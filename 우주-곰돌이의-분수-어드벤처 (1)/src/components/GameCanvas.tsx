import React, { useRef, useEffect, useCallback } from 'react';
import {
  FractionProblem,
  PlayerProfile,
  FloatingOrb,
  SpaceItem,
  SpaceObstacle,
  Particle,
  ActiveBuffs,
  ItemType,
  BearSkinInfo,
} from '../types/game';
import { BEAR_SKINS, STAGE_CONFIGS, areFractionsEqual } from '../utils/mathGenerator';
import { soundManager } from '../utils/audio';

interface GameCanvasProps {
  currentProblem: FractionProblem;
  profile: PlayerProfile;
  activeBuffs: ActiveBuffs;
  onAnswerSelected: (orb: FloatingOrb) => void;
  onItemCollected: (item: SpaceItem) => void;
  onObstacleHit: () => void;
  isPaused: boolean;
  lives: number;
  stage: number;
  combo: number;
  joystickInput: { x: number; y: number };
}

export const GameCanvas: React.FC<GameCanvasProps> = ({
  currentProblem,
  profile,
  activeBuffs,
  onAnswerSelected,
  onItemCollected,
  onObstacleHit,
  isPaused,
  lives,
  stage,
  combo,
  joystickInput,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Player state
  const playerRef = useRef({
    x: 400,
    y: 300,
    vx: 0,
    vy: 0,
    radius: 34,
    facing: 1, // 1: right, -1: left
    tilt: 0,
    blinkTimer: 0,
    isBlinking: false,
    hitShakeTimer: 0,
    happyTimer: 0,
  });

  // Game world objects
  const orbsRef = useRef<FloatingOrb[]>([]);
  const itemsRef = useRef<SpaceItem[]>([]);
  const obstaclesRef = useRef<SpaceObstacle[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const starsRef = useRef<{ x: number; y: number; size: number; speed: number; alpha: number }[]>([]);

  // Controls state
  const keysRef = useRef<{ [key: string]: boolean }>({});

  const skinInfo: BearSkinInfo = BEAR_SKINS.find((s) => s.id === profile.skin) || BEAR_SKINS[0];
  const stageConfig = STAGE_CONFIGS.find((s) => s.stage === stage) || STAGE_CONFIGS[0];

  // Initialize stars once
  useEffect(() => {
    const stars: { x: number; y: number; size: number; speed: number; alpha: number }[] = [];
    for (let i = 0; i < 140; i++) {
      stars.push({
        x: Math.random() * 2000,
        y: Math.random() * 1200,
        size: Math.random() * 2.2 + 0.8,
        speed: Math.random() * 0.8 + 0.2,
        alpha: Math.random() * 0.8 + 0.2,
      });
    }
    starsRef.current = stars;
  }, []);

  // Spawn orbs whenever problem changes
  useEffect(() => {
    if (!canvasRef.current || !currentProblem) return;
    const canvas = canvasRef.current;
    const width = canvas.width || 800;
    const height = canvas.height || 600;

    const newOrbs: FloatingOrb[] = [];
    const colors = ['#38bdf8', '#818cf8', '#ec4899', '#34d399', '#f59e0b'];

    // Spawn 4 options
    currentProblem.options.forEach((opt, idx) => {
      const isCorrect = areFractionsEqual(opt, currentProblem.answer);
      
      // Distribute evenly around the screen avoiding middle where player is
      const side = idx % 4; // 0: top, 1: right, 2: bottom, 3: left
      let x = 0;
      let y = 0;
      let vx = (Math.random() - 0.5) * 1.5;
      let vy = (Math.random() - 0.5) * 1.5;

      const padding = 70;
      if (side === 0) {
        x = padding + Math.random() * (width - padding * 2);
        y = padding + Math.random() * 120;
        vy = Math.random() * 0.8 + 0.4;
      } else if (side === 1) {
        x = width - padding - Math.random() * 120;
        y = padding + Math.random() * (height - padding * 2);
        vx = -(Math.random() * 0.8 + 0.4);
      } else if (side === 2) {
        x = padding + Math.random() * (width - padding * 2);
        y = height - padding - Math.random() * 120;
        vy = -(Math.random() * 0.8 + 0.4);
      } else {
        x = padding + Math.random() * 120;
        y = padding + Math.random() * (height - padding * 2);
        vx = Math.random() * 0.8 + 0.4;
      }

      newOrbs.push({
        id: `orb_${idx}_${Date.now()}`,
        fraction: opt,
        isCorrect,
        x,
        y,
        vx,
        vy,
        radius: 46,
        color: colors[idx % colors.length],
        pulsePhase: Math.random() * Math.PI * 2,
        isHinted: false,
      });
    });

    orbsRef.current = newOrbs;
  }, [currentProblem]);

  // Keyboard Event Listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keysRef.current[e.code] = true;
      keysRef.current[e.key] = true;
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      keysRef.current[e.code] = false;
      keysRef.current[e.key] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Spawn random items and meteors periodically
  useEffect(() => {
    if (isPaused) return;

    const itemTimer = setInterval(() => {
      if (!canvasRef.current) return;
      if (itemsRef.current.length >= 3) return; // Max 3 items on screen

      const types: ItemType[] = ['heart', 'shield', 'magnet', 'freeze', 'bomb', 'doubleStar', 'hint'];
      const chosenType = types[Math.floor(Math.random() * types.length)];
      const canvas = canvasRef.current;

      const itemMeta: Record<ItemType, { icon: string; name: string; color: string }> = {
        heart: { icon: '💖', name: '생명 하트', color: '#f43f5e' },
        shield: { icon: '🛡️', name: '우주 쉴드', color: '#38bdf8' },
        magnet: { icon: '🧲', name: '별빛 자석', color: '#818cf8' },
        freeze: { icon: '⏱️', name: '시간 정지', color: '#34d399' },
        bomb: { icon: '💣', name: '오답 폭탄', color: '#f59e0b' },
        doubleStar: { icon: '🌟', name: '2배 점수', color: '#eab308' },
        hint: { icon: '💡', name: '정답 레이더', color: '#fbbf24' },
      };

      const meta = itemMeta[chosenType];
      itemsRef.current.push({
        id: `item_${Date.now()}`,
        type: chosenType,
        x: Math.random() * (canvas.width - 100) + 50,
        y: Math.random() * (canvas.height - 100) + 50,
        vx: (Math.random() - 0.5) * 0.8,
        vy: (Math.random() - 0.5) * 0.8,
        radius: 26,
        icon: meta.icon,
        name: meta.name,
        color: meta.color,
        createdAt: Date.now(),
        duration: 12000, // 12 seconds on screen
      });
    }, 9000);

    // Obstacles spawn for stage 2+
    const obstacleTimer = setInterval(() => {
      if (!canvasRef.current || stage < 2) return;
      if (obstaclesRef.current.length >= Math.min(stage, 4)) return;

      const canvas = canvasRef.current;
      const x = Math.random() > 0.5 ? -40 : canvas.width + 40;
      const y = Math.random() * canvas.height;
      const targetX = canvas.width / 2;
      const targetY = canvas.height / 2;
      const angle = Math.atan2(targetY - y, targetX - x) + (Math.random() - 0.5) * 0.5;
      const speed = (Math.random() * 1.5 + 1.2) * stageConfig.speedMultiplier;

      obstaclesRef.current.push({
        id: `obs_${Date.now()}`,
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        radius: 24,
        rotation: 0,
        rotSpeed: (Math.random() - 0.5) * 0.05,
        type: 'meteor',
      });
    }, 7000);

    return () => {
      clearInterval(itemTimer);
      clearInterval(obstacleTimer);
    };
  }, [isPaused, stage, stageConfig.speedMultiplier]);

  // Main Canvas Render & Physics Loop
  useEffect(() => {
    let animationFrameId: number;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Handle canvas resizing
    const resizeCanvas = () => {
      const parent = canvas.parentElement;
      if (parent) {
        canvas.width = parent.clientWidth;
        canvas.height = parent.clientHeight;
        if (playerRef.current.x > canvas.width) playerRef.current.x = canvas.width / 2;
        if (playerRef.current.y > canvas.height) playerRef.current.y = canvas.height / 2;
      }
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Trigger bomb effect: clears all wrong answer orbs and converts to particles
    const triggerBombExplosion = () => {
      soundManager.playBomb();
      const currentOrbs = orbsRef.current;
      currentOrbs.forEach((orb) => {
        if (!orb.isCorrect) {
          // Explode wrong orb
          for (let p = 0; p < 20; p++) {
            particlesRef.current.push({
              x: orb.x,
              y: orb.y,
              vx: (Math.random() - 0.5) * 8,
              vy: (Math.random() - 0.5) * 8,
              color: '#f59e0b',
              size: Math.random() * 5 + 3,
              alpha: 1,
              life: 0,
              maxLife: 30,
            });
          }
        }
      });
      // Filter out wrong orbs
      orbsRef.current = currentOrbs.filter((o) => o.isCorrect);
    };

    // Game loop
    const render = () => {
      if (!isPaused) {
        updatePhysics(canvas);
      }
      drawScene(ctx, canvas);
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [
    isPaused,
    activeBuffs,
    currentProblem,
    lives,
    stage,
    combo,
    joystickInput,
    onAnswerSelected,
    onItemCollected,
    onObstacleHit,
  ]);

  // Update game physics
  const updatePhysics = (canvas: HTMLCanvasElement) => {
    const width = canvas.width;
    const height = canvas.height;
    const player = playerRef.current;
    const keys = keysRef.current;

    const isFrozen = Date.now() < activeBuffs.freezeUntil;
    const isMagnetActive = Date.now() < activeBuffs.magnetUntil;
    const isHintActive = Date.now() < activeBuffs.hintUntil;
    const speedMult = isFrozen ? 0.35 : 1.0;

    // 1. Player Movement Input
    let moveX = 0;
    let moveY = 0;

    if (keys['ArrowUp'] || keys['KeyW']) moveY -= 1;
    if (keys['ArrowDown'] || keys['KeyS']) moveY += 1;
    if (keys['ArrowLeft'] || keys['KeyA']) moveX -= 1;
    if (keys['ArrowRight'] || keys['KeyD']) moveX += 1;

    // Add joystick input
    if (joystickInput.x !== 0 || joystickInput.y !== 0) {
      moveX += joystickInput.x;
      moveY += joystickInput.y;
    }

    // Normalize diagonal
    const mag = Math.hypot(moveX, moveY);
    if (mag > 0.05) {
      const baseSpeed = 5.8 * (1 + skinInfo.speedBonus);
      const targetVx = (moveX / Math.max(1, mag)) * baseSpeed;
      const targetVy = (moveY / Math.max(1, mag)) * baseSpeed;

      player.vx += (targetVx - player.vx) * 0.22;
      player.vy += (targetVy - player.vy) * 0.22;

      if (moveX > 0.1) player.facing = 1;
      else if (moveX < -0.1) player.facing = -1;

      player.tilt = (player.vx / baseSpeed) * 0.25;

      // Spawn thruster flame particles
      if (Math.random() < 0.7) {
        const flameOffset = player.facing === 1 ? -24 : 24;
        particlesRef.current.push({
          x: player.x + flameOffset + (Math.random() - 0.5) * 6,
          y: player.y + 16 + (Math.random() - 0.5) * 4,
          vx: -player.vx * 0.3 + (Math.random() - 0.5) * 1.5,
          vy: Math.random() * 2 + 1,
          color: Math.random() > 0.4 ? '#f97316' : '#38bdf8',
          size: Math.random() * 4 + 2,
          alpha: 1,
          life: 0,
          maxLife: 20,
        });
      }
    } else {
      player.vx *= 0.88;
      player.vy *= 0.88;
      player.tilt *= 0.85;
    }

    // Move player
    player.x += player.vx;
    player.y += player.vy;

    // Boundaries
    const pad = player.radius + 10;
    if (player.x < pad) {
      player.x = pad;
      player.vx = 0;
    }
    if (player.x > width - pad) {
      player.x = width - pad;
      player.vx = 0;
    }
    if (player.y < pad) {
      player.y = pad;
      player.vy = 0;
    }
    if (player.y > height - pad) {
      player.y = height - pad;
      player.vy = 0;
    }

    // Blinking timer
    player.blinkTimer++;
    if (player.blinkTimer > 180) {
      player.isBlinking = true;
      if (player.blinkTimer > 195) {
        player.blinkTimer = 0;
        player.isBlinking = false;
      }
    }

    if (player.hitShakeTimer > 0) player.hitShakeTimer--;
    if (player.happyTimer > 0) player.happyTimer--;

    // 2. Update Stars background
    starsRef.current.forEach((s) => {
      s.x -= s.speed * speedMult;
      if (s.x < 0) s.x = width + Math.random() * 100;
    });

    // 3. Update Floating Orbs
    orbsRef.current.forEach((orb) => {
      orb.pulsePhase += 0.05;
      orb.isHinted = isHintActive && orb.isCorrect;

      // Magnet attraction for correct answer
      if (isMagnetActive && orb.isCorrect) {
        const dx = player.x - orb.x;
        const dy = player.y - orb.y;
        const dist = Math.hypot(dx, dy);
        if (dist > 5) {
          orb.vx += (dx / dist) * 0.45;
          orb.vy += (dy / dist) * 0.45;
          orb.vx *= 0.95;
          orb.vy *= 0.95;
        }
      } else {
        orb.x += orb.vx * speedMult * stageConfig.speedMultiplier;
        orb.y += orb.vy * speedMult * stageConfig.speedMultiplier;

        // Bounce off canvas boundaries
        if (orb.x < orb.radius) {
          orb.x = orb.radius;
          orb.vx *= -1;
        }
        if (orb.x > width - orb.radius) {
          orb.x = width - orb.radius;
          orb.vx *= -1;
        }
        if (orb.y < orb.radius) {
          orb.y = orb.radius;
          orb.vy *= -1;
        }
        if (orb.y > height - orb.radius) {
          orb.y = height - orb.radius;
          orb.vy *= -1;
        }
      }

      // Orb collision with Bear
      const distToPlayer = Math.hypot(player.x - orb.x, player.y - orb.y);
      if (distToPlayer < player.radius + orb.radius - 12) {
        // Handle answer
        if (orb.isCorrect) {
          player.happyTimer = 40;
          createExplosion(orb.x, orb.y, '#34d399', 24);
          particlesRef.current.push({
            x: orb.x,
            y: orb.y - 30,
            vx: 0,
            vy: -1.5,
            color: '#34d399',
            size: 20,
            alpha: 1,
            life: 0,
            maxLife: 45,
            text: `+${(100 * (combo + 1) * (Date.now() < activeBuffs.doubleStarUntil ? 2 : 1))} 💖 정답!`,
          });
        } else {
          player.hitShakeTimer = 25;
          createExplosion(orb.x, orb.y, '#ef4444', 20);
          particlesRef.current.push({
            x: orb.x,
            y: orb.y - 30,
            vx: 0,
            vy: -1.5,
            color: '#f87171',
            size: 18,
            alpha: 1,
            life: 0,
            maxLife: 45,
            text: activeBuffs.shield ? '🛡️ 쉴드 방어!' : '💔 오답! -1 목숨',
          });
        }

        onAnswerSelected(orb);
      }
    });

    // 4. Update Space Items
    itemsRef.current.forEach((item, index) => {
      item.x += item.vx * speedMult;
      item.y += item.vy * speedMult;

      // Wrap or bounce
      if (item.x < item.radius || item.x > width - item.radius) item.vx *= -1;
      if (item.y < item.radius || item.y > height - item.radius) item.vy *= -1;

      // Item collision with Bear
      const dist = Math.hypot(player.x - item.x, player.y - item.y);
      if (dist < player.radius + item.radius) {
        createExplosion(item.x, item.y, item.color, 16);
        particlesRef.current.push({
          x: item.x,
          y: item.y - 20,
          vx: 0,
          vy: -1.8,
          color: item.color,
          size: 16,
          alpha: 1,
          life: 0,
          maxLife: 40,
          text: `[${item.name}] 획득!`,
        });

        onItemCollected(item);
        itemsRef.current.splice(index, 1);
      }
    });

    // Clean expired items
    const now = Date.now();
    itemsRef.current = itemsRef.current.filter((item) => now - item.createdAt < item.duration);

    // 5. Update Obstacles (Meteors)
    obstaclesRef.current.forEach((obs, index) => {
      obs.x += obs.vx * speedMult;
      obs.y += obs.vy * speedMult;
      obs.rotation += obs.rotSpeed;

      // Collision with Bear
      const dist = Math.hypot(player.x - obs.x, player.y - obs.y);
      if (dist < player.radius + obs.radius - 8) {
        player.hitShakeTimer = 20;
        player.vx = obs.vx * 3;
        player.vy = obs.vy * 3;
        createExplosion(obs.x, obs.y, '#f97316', 15);
        onObstacleHit();
        obstaclesRef.current.splice(index, 1);
      }
    });

    // Clean offscreen meteors
    obstaclesRef.current = obstaclesRef.current.filter(
      (obs) => obs.x > -100 && obs.x < width + 100 && obs.y > -100 && obs.y < height + 100
    );

    // 6. Update Particles
    particlesRef.current.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;
      p.life++;
      p.alpha = Math.max(0, 1 - p.life / p.maxLife);
    });
    particlesRef.current = particlesRef.current.filter((p) => p.life < p.maxLife);
  };

  const createExplosion = (x: number, y: number, color: string, count: number) => {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 5 + 1.5;
      particlesRef.current.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        color,
        size: Math.random() * 5 + 2.5,
        alpha: 1,
        life: 0,
        maxLife: Math.floor(Math.random() * 20 + 20),
      });
    }
  };

  // Draw scene to canvas
  const drawScene = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    const width = canvas.width;
    const height = canvas.height;
    const player = playerRef.current;

    ctx.clearRect(0, 0, width, height);

    // 1. Nebula background gradient
    const bgGrad = ctx.createRadialGradient(
      width / 2,
      height / 2,
      50,
      width / 2,
      height / 2,
      Math.max(width, height)
    );
    bgGrad.addColorStop(0, stageConfig.bgNebulaColor);
    bgGrad.addColorStop(0.7, 'rgba(15, 23, 42, 0.95)');
    bgGrad.addColorStop(1, '#030712');

    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);

    // 2. Starfield
    starsRef.current.forEach((s) => {
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${s.alpha})`;
      ctx.fill();
    });

    // 3. Draw Items
    itemsRef.current.forEach((item) => {
      drawSpaceItem(ctx, item);
    });

    // 4. Draw Obstacles (Meteors)
    obstaclesRef.current.forEach((obs) => {
      drawMeteor(ctx, obs);
    });

    // 5. Draw Floating Fraction Orbs
    orbsRef.current.forEach((orb) => {
      drawFractionOrb(ctx, orb);
    });

    // 6. Draw Space Bear Character
    drawSpaceBear(ctx, player);

    // 7. Draw Floating Particles & Score Texts
    particlesRef.current.forEach((p) => {
      if (p.text) {
        ctx.save();
        ctx.font = 'bold 15px sans-serif';
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.textAlign = 'center';
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 8;
        ctx.fillText(p.text, p.x, p.y);
        ctx.restore();
      } else {
        ctx.save();
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 6;
        ctx.fill();
        ctx.restore();
      }
    });
  };

  // Draw Space Item
  const drawSpaceItem = (ctx: CanvasRenderingContext2D, item: SpaceItem) => {
    ctx.save();
    ctx.translate(item.x, item.y);

    const pulse = Math.sin(Date.now() * 0.006) * 3;

    // Glowing Aura
    const aura = ctx.createRadialGradient(0, 0, 5, 0, 0, item.radius + 10 + pulse);
    aura.addColorStop(0, item.color);
    aura.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = aura;
    ctx.beginPath();
    ctx.arc(0, 0, item.radius + 10 + pulse, 0, Math.PI * 2);
    ctx.fill();

    // Item Circle
    ctx.beginPath();
    ctx.arc(0, 0, item.radius, 0, Math.PI * 2);
    ctx.fillStyle = '#0f172a';
    ctx.strokeStyle = item.color;
    ctx.lineWidth = 2.5;
    ctx.fill();
    ctx.stroke();

    // Item Icon
    ctx.font = '16px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(item.icon, 0, 1);

    ctx.restore();
  };

  // Draw Meteor
  const drawMeteor = (ctx: CanvasRenderingContext2D, obs: SpaceObstacle) => {
    ctx.save();
    ctx.translate(obs.x, obs.y);
    ctx.rotate(obs.rotation);

    // Trail
    ctx.fillStyle = 'rgba(249, 115, 22, 0.25)';
    ctx.beginPath();
    ctx.arc(-obs.vx * 4, -obs.vy * 4, obs.radius * 0.8, 0, Math.PI * 2);
    ctx.fill();

    // Meteor body
    ctx.fillStyle = '#78350f';
    ctx.strokeStyle = '#f97316';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(0, 0, obs.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Craters
    ctx.fillStyle = '#451a03';
    ctx.beginPath();
    ctx.arc(-6, -5, 5, 0, Math.PI * 2);
    ctx.arc(7, 4, 4, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  };

  // Draw Fraction Answer Orb
  const drawFractionOrb = (ctx: CanvasRenderingContext2D, orb: FloatingOrb) => {
    ctx.save();
    ctx.translate(orb.x, orb.y);

    const pulse = Math.sin(orb.pulsePhase) * 3;
    const r = orb.radius + pulse;

    // Golden Hint Ring if hinted
    if (orb.isHinted) {
      ctx.strokeStyle = '#facc15';
      ctx.lineWidth = 4;
      ctx.setLineDash([6, 4]);
      ctx.beginPath();
      ctx.arc(0, 0, r + 12, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // Outer Glow
    const glow = ctx.createRadialGradient(0, 0, r * 0.2, 0, 0, r + 10);
    glow.addColorStop(0, `${orb.color}88`);
    glow.addColorStop(0.8, `${orb.color}22`);
    glow.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(0, 0, r + 10, 0, Math.PI * 2);
    ctx.fill();

    // Orb Body
    const bodyGrad = ctx.createRadialGradient(-r * 0.3, -r * 0.3, 4, 0, 0, r);
    bodyGrad.addColorStop(0, '#1e293b');
    bodyGrad.addColorStop(0.8, '#0f172a');
    bodyGrad.addColorStop(1, '#020617');

    ctx.fillStyle = bodyGrad;
    ctx.strokeStyle = orb.isHinted ? '#facc15' : orb.color;
    ctx.lineWidth = orb.isHinted ? 3.5 : 2.5;
    ctx.beginPath();
    ctx.arc(0, 0, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Draw Fraction Text inside Orb
    drawFractionTextOnCanvas(ctx, orb.fraction);

    ctx.restore();
  };

  // Render mathematical fraction on canvas inside orb
  const drawFractionTextOnCanvas = (ctx: CanvasRenderingContext2D, f: { whole: number; numerator: number; denominator: number }) => {
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const hasWhole = f.whole > 0;
    const hasFraction = f.denominator > 0 && f.numerator > 0;

    // 자연수만 있는 경우
    if (hasWhole && !hasFraction) {
      ctx.font = 'bold 26px sans-serif';
      ctx.fillText(`${f.whole}`, 0, 0);
      return;
    }

    // 진분수 (자연수 없음)
    if (!hasWhole) {
      ctx.font = 'bold 16px sans-serif';
      ctx.fillText(`${f.numerator}`, 0, -11);

      // Fraction bar
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(-16, 0);
      ctx.lineTo(16, 0);
      ctx.stroke();

      ctx.fillText(`${f.denominator}`, 0, 12);
      return;
    }

    // 대분수 (자연수 + 진분수)
    // 자연수
    ctx.font = 'bold 22px sans-serif';
    ctx.fillText(`${f.whole}`, -16, 0);

    // 분자 & 분모
    ctx.font = 'bold 14px sans-serif';
    ctx.fillText(`${f.numerator}`, 14, -9);

    // Fraction bar
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.moveTo(3, 0);
    ctx.lineTo(25, 0);
    ctx.stroke();

    ctx.fillText(`${f.denominator}`, 14, 10);
  };

  // Draw Space Bear Character
  const drawSpaceBear = (
    ctx: CanvasRenderingContext2D,
    player: {
      x: number;
      y: number;
      facing: number;
      tilt: number;
      isBlinking: boolean;
      hitShakeTimer: number;
      happyTimer: number;
    }
  ) => {
    ctx.save();
    
    // Shake effect on wrong hit
    let shakeX = 0;
    let shakeY = 0;
    if (player.hitShakeTimer > 0) {
      shakeX = (Math.random() - 0.5) * 8;
      shakeY = (Math.random() - 0.5) * 8;
    }

    ctx.translate(player.x + shakeX, player.y + shakeY);
    ctx.rotate(player.tilt);
    ctx.scale(player.facing, 1);

    // 1. Active Shield Energy Bubble
    if (activeBuffs.shield) {
      ctx.save();
      const shieldPulse = Math.sin(Date.now() * 0.008) * 3;
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 3;
      ctx.fillStyle = 'rgba(56, 189, 248, 0.18)';
      ctx.beginPath();
      ctx.arc(0, 0, playerRef.current.radius + 14 + shieldPulse, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.restore();
    }

    // 2. Active Magnet Aura
    if (Date.now() < activeBuffs.magnetUntil) {
      ctx.save();
      ctx.strokeStyle = 'rgba(129, 140, 248, 0.6)';
      ctx.lineWidth = 2;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.arc(0, 0, playerRef.current.radius + 22, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }

    // 3. Jetpack on back
    ctx.fillStyle = '#64748b';
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(-26, -10, 16, 26, 4);
    ctx.fill();
    ctx.stroke();

    // Jetpack nozzle
    ctx.fillStyle = '#0284c7';
    ctx.fillRect(-24, 16, 12, 6);

    // 4. Bear Suit Body
    ctx.fillStyle = skinInfo.suitColor;
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.ellipse(0, 8, 20, 18, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Chest badge
    ctx.fillStyle = skinInfo.accentColor;
    ctx.beginPath();
    ctx.arc(4, 8, 4, 0, Math.PI * 2);
    ctx.fill();

    // 5. Bear Ears
    ctx.fillStyle = skinInfo.earColor;
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 2;

    // Left Ear
    ctx.beginPath();
    ctx.arc(-14, -20, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Right Ear
    ctx.beginPath();
    ctx.arc(14, -20, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Ear Inner
    ctx.fillStyle = '#fda4af';
    ctx.beginPath();
    ctx.arc(-14, -20, 4.5, 0, Math.PI * 2);
    ctx.arc(14, -20, 4.5, 0, Math.PI * 2);
    ctx.fill();

    // 6. Bear Head
    ctx.fillStyle = skinInfo.earColor;
    ctx.beginPath();
    ctx.arc(0, -10, 16, 0, Math.PI * 2);
    ctx.fill();

    // 7. Astronaut Helmet Glass Bubble
    ctx.fillStyle = 'rgba(224, 242, 254, 0.35)';
    ctx.strokeStyle = skinInfo.accentColor;
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.arc(0, -10, 22, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // 8. Snout
    ctx.fillStyle = '#fef08a';
    ctx.beginPath();
    ctx.ellipse(2, -6, 8, 6, 0, 0, Math.PI * 2);
    ctx.fill();

    // Nose
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.ellipse(2, -9, 3, 2, 0, 0, Math.PI * 2);
    ctx.fill();

    // Mouth / Expression
    if (player.happyTimer > 0) {
      // Big happy smile
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(2, -7, 4, 0, Math.PI);
      ctx.stroke();
    } else if (player.hitShakeTimer > 0) {
      // Ouch O mouth
      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.arc(2, -5, 2.5, 0, Math.PI * 2);
      ctx.fill();
    } else {
      // Normal cute smile
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(2, -6, 3, 0.2, Math.PI - 0.2);
      ctx.stroke();
    }

    // 9. Bear Eyes
    if (player.isBlinking) {
      // Blinking lines
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(-7, -13);
      ctx.lineTo(-2, -13);
      ctx.moveTo(5, -13);
      ctx.lineTo(10, -13);
      ctx.stroke();
    } else {
      // Sparkly eyes
      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.arc(-4, -13, 2.5, 0, Math.PI * 2);
      ctx.arc(7, -13, 2.5, 0, Math.PI * 2);
      ctx.fill();

      // Eye highlights
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(-3.5, -14, 1, 0, Math.PI * 2);
      ctx.arc(7.5, -14, 1, 0, Math.PI * 2);
      ctx.fill();
    }

    // 10. Helmet Glass reflection shine
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.75)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(0, -10, 18, -Math.PI * 0.75, -Math.PI * 0.25);
    ctx.stroke();

    ctx.restore();
  };

  return (
    <div className="relative w-full h-full min-h-[480px] select-none touch-none">
      <canvas
        ref={canvasRef}
        className="w-full h-full block bg-slate-950 cursor-crosshair"
      />
    </div>
  );
};
