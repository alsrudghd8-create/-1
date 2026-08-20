/**
 * Space Bear Fraction Game (우주 곰돌이의 분수 어드벤처)
 * 4th Grade Semester 2 Mathematics: Fraction Addition & Subtraction
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  PlayerProfile,
  FractionProblem,
  ActiveBuffs,
  FloatingOrb,
  SpaceItem,
  GameScoreRecord,
  WrongQuestionReview,
} from './types/game';
import { STAGE_CONFIGS, generateProblem } from './utils/mathGenerator';
import { soundManager } from './utils/audio';
import { StartScreen } from './components/StartScreen';
import { GameCanvas } from './components/GameCanvas';
import { GameHUD } from './components/GameHUD';
import { StageClearModal } from './components/StageClearModal';
import { GameOverModal } from './components/GameOverModal';
import { MathConceptModal } from './components/MathConceptModal';
import { HintModal } from './components/HintModal';
import { HallOfFameModal } from './components/HallOfFameModal';

const MAX_LIVES = 5;

export default function App() {
  // Game Lifecycle State
  const [gameState, setGameState] = useState<'start' | 'playing' | 'stageClear' | 'gameOver'>('start');

  // Player Profile
  const [profile, setProfile] = useState<PlayerProfile>(() => {
    const saved = localStorage.getItem('space_bear_profile');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // Fallback
      }
    }
    return {
      studentNumber: '',
      studentName: '',
      skin: 'classic',
      soundEnabled: true,
      bgmEnabled: true,
    };
  });

  // Gameplay State
  const [currentStage, setCurrentStage] = useState<number>(1);
  const [currentProblem, setCurrentProblem] = useState<FractionProblem | null>(null);
  const [lives, setLives] = useState<number>(MAX_LIVES);
  const [score, setScore] = useState<number>(0);
  const [stageScore, setStageScore] = useState<number>(0);
  const [combo, setCombo] = useState<number>(0);
  const [maxCombo, setMaxCombo] = useState<number>(0);
  const [totalAnswered, setTotalAnswered] = useState<number>(0);
  const [correctAnswered, setCorrectAnswered] = useState<number>(0);
  const [stageProgress, setStageProgress] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [wrongReviews, setWrongReviews] = useState<WrongQuestionReview[]>([]);

  // Active Buffs
  const [activeBuffs, setActiveBuffs] = useState<ActiveBuffs>({
    shield: false,
    magnetUntil: 0,
    freezeUntil: 0,
    doubleStarUntil: 0,
    hintUntil: 0,
  });

  // Joystick state for touch screen
  const [joystickInput, setJoystickInput] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Modal visibility states
  const [showConceptGuide, setShowConceptGuide] = useState<boolean>(false);
  const [showHintModal, setShowHintModal] = useState<boolean>(false);
  const [showHallOfFame, setShowHallOfFame] = useState<boolean>(false);

  // Leaderboard Records
  const [scoreRecords, setScoreRecords] = useState<GameScoreRecord[]>(() => {
    const saved = localStorage.getItem('space_bear_scores');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // Fallback
      }
    }
    return [];
  });

  // Save profile to localStorage when changed
  useEffect(() => {
    localStorage.setItem('space_bear_profile', JSON.stringify(profile));
  }, [profile]);

  // Save score records to localStorage
  const saveRecord = useCallback((finalScore: number, finalMaxCombo: number, stageNum: number, accuracyNum: number) => {
    if (!profile.studentName) return;
    const now = new Date();
    const dateStr = `${now.getMonth() + 1}/${now.getDate()} ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    
    const newRecord: GameScoreRecord = {
      id: `rec_${Date.now()}`,
      studentNumber: profile.studentNumber,
      studentName: profile.studentName,
      score: finalScore,
      maxCombo: finalMaxCombo,
      stageReached: stageNum,
      date: dateStr,
      accuracy: accuracyNum,
    };

    setScoreRecords((prev) => {
      const updated = [newRecord, ...prev]
        .sort((a, b) => b.score - a.score)
        .slice(0, 30); // Top 30
      localStorage.setItem('space_bear_scores', JSON.stringify(updated));
      return updated;
    });
  }, [profile.studentName, profile.studentNumber]);

  const clearScoreRecords = () => {
    setScoreRecords([]);
    localStorage.removeItem('space_bear_scores');
  };

  // Start new stage / game session
  const startGame = (targetStage: number = 1) => {
    setCurrentStage(targetStage);
    setLives(MAX_LIVES);
    setScore(0);
    setStageScore(0);
    setCombo(0);
    setMaxCombo(0);
    setTotalAnswered(0);
    setCorrectAnswered(0);
    setStageProgress(0);
    setWrongReviews([]);
    setIsPaused(false);
    setActiveBuffs({
      shield: false,
      magnetUntil: 0,
      freezeUntil: 0,
      doubleStarUntil: 0,
      hintUntil: 0,
    });

    const firstProb = generateProblem(targetStage);
    setCurrentProblem(firstProb);
    setGameState('playing');
  };

  // Next stage after clearing
  const proceedToNextStage = () => {
    const nextStage = currentStage + 1;
    setCurrentStage(nextStage);
    setStageProgress(0);
    setStageScore(0);
    // Give +1 bonus heart if lives < MAX_LIVES
    setLives((prev) => Math.min(MAX_LIVES, prev + 1));
    const nextProb = generateProblem(nextStage);
    setCurrentProblem(nextProb);
    setGameState('playing');
  };

  // Replay current stage
  const replayCurrentStage = () => {
    setLives(MAX_LIVES);
    setStageProgress(0);
    setStageScore(0);
    setWrongReviews([]);
    const nextProb = generateProblem(currentStage);
    setCurrentProblem(nextProb);
    setGameState('playing');
  };

  // Handle Answer Hit
  const handleAnswerSelected = (orb: FloatingOrb) => {
    if (!currentProblem) return;

    setTotalAnswered((prev) => prev + 1);

    if (orb.isCorrect) {
      // Correct!
      soundManager.playCorrect();
      const nextCombo = combo + 1;
      setCombo(nextCombo);
      setMaxCombo((prev) => Math.max(prev, nextCombo));
      setCorrectAnswered((prev) => prev + 1);

      // Play combo jingle if streak
      if (nextCombo > 2) {
        soundManager.playCombo(nextCombo);
      }

      // Combo bonus heart: Every 4 combo restores 1 heart if not full
      if (nextCombo % 4 === 0) {
        setLives((prev) => Math.min(MAX_LIVES, prev + 1));
      }

      // Calculate score with combo and 2x bonus multiplier
      const isDouble = Date.now() < activeBuffs.doubleStarUntil;
      const basePoints = 100 * (1 + nextCombo * 0.2);
      const earned = Math.round(basePoints * (isDouble ? 2 : 1));

      setScore((prev) => prev + earned);
      setStageScore((prev) => prev + earned);

      const nextProg = stageProgress + 1;
      setStageProgress(nextProg);

      const currentStageConfig = STAGE_CONFIGS.find((s) => s.stage === currentStage) || STAGE_CONFIGS[0];

      if (nextProg >= currentStageConfig.requiredQuestions) {
        // Stage Cleared!
        const finalAccuracy = (correctAnswered + 1) / (totalAnswered + 1) * 100;
        saveRecord(score + earned, Math.max(maxCombo, nextCombo), currentStage, finalAccuracy);
        setGameState('stageClear');
      } else {
        // Next Problem in same stage
        setTimeout(() => {
          setCurrentProblem(generateProblem(currentStage));
        }, 300);
      }
    } else {
      // Wrong Answer!
      // Add to review list
      setWrongReviews((prev) => [
        ...prev,
        {
          problem: currentProblem,
          selectedWrongAnswer: orb.fraction,
          timestamp: Date.now(),
        },
      ]);

      setCombo(0); // Reset combo

      if (activeBuffs.shield) {
        // Block with shield
        soundManager.playShieldHit();
        setActiveBuffs((prev) => ({ ...prev, shield: false }));
      } else {
        // Lose life
        soundManager.playWrong();
        const nextLives = lives - 1;
        setLives(nextLives);

        if (nextLives <= 0) {
          // Game Over!
          const finalAccuracy = (correctAnswered / Math.max(1, totalAnswered + 1)) * 100;
          saveRecord(score, maxCombo, currentStage, finalAccuracy);
          setGameState('gameOver');
          return;
        }
      }

      // Generate new problem or continue
      setTimeout(() => {
        setCurrentProblem(generateProblem(currentStage));
      }, 400);
    }
  };

  // Handle Item Collection
  const handleItemCollected = (item: SpaceItem) => {
    soundManager.playItem();

    switch (item.type) {
      case 'heart':
        setLives((prev) => Math.min(MAX_LIVES, prev + 1));
        break;
      case 'shield':
        setActiveBuffs((prev) => ({ ...prev, shield: true }));
        break;
      case 'magnet':
        setActiveBuffs((prev) => ({ ...prev, magnetUntil: Date.now() + 9000 }));
        break;
      case 'freeze':
        soundManager.playTimeFreeze();
        setActiveBuffs((prev) => ({ ...prev, freezeUntil: Date.now() + 7000 }));
        break;
      case 'bomb':
        soundManager.playBomb();
        // Bomb handled in canvas particle effect
        break;
      case 'doubleStar':
        setActiveBuffs((prev) => ({ ...prev, doubleStarUntil: Date.now() + 10000 }));
        break;
      case 'hint':
        setActiveBuffs((prev) => ({ ...prev, hintUntil: Date.now() + 10000 }));
        break;
    }
  };

  // Handle Obstacle Hit (meteor bump)
  const handleObstacleHit = () => {
    if (activeBuffs.shield) {
      soundManager.playShieldHit();
      setActiveBuffs((prev) => ({ ...prev, shield: false }));
    } else {
      soundManager.playWrong();
      const nextLives = lives - 1;
      setLives(nextLives);
      if (nextLives <= 0) {
        const finalAccuracy = (correctAnswered / Math.max(1, totalAnswered)) * 100;
        saveRecord(score, maxCombo, currentStage, finalAccuracy);
        setGameState('gameOver');
      }
    }
  };

  const currentStageConfig = STAGE_CONFIGS.find((s) => s.stage === currentStage) || STAGE_CONFIGS[0];
  const accuracy = totalAnswered > 0 ? (correctAnswered / totalAnswered) * 100 : 100;

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-slate-950 font-sans text-slate-100 flex flex-col select-none">
      {/* 1. Main Start Screen */}
      {gameState === 'start' && (
        <StartScreen
          profile={profile}
          onUpdateProfile={setProfile}
          onStartGame={startGame}
          onOpenConceptGuide={() => setShowConceptGuide(true)}
          onOpenHallOfFame={() => setShowHallOfFame(true)}
        />
      )}

      {/* 2. Active Game Screen */}
      {gameState === 'playing' && currentProblem && (
        <div className="relative w-full h-full">
          <GameCanvas
            currentProblem={currentProblem}
            profile={profile}
            activeBuffs={activeBuffs}
            onAnswerSelected={handleAnswerSelected}
            onItemCollected={handleItemCollected}
            onObstacleHit={handleObstacleHit}
            isPaused={isPaused}
            lives={lives}
            stage={currentStage}
            combo={combo}
            joystickInput={joystickInput}
          />

          <GameHUD
            currentProblem={currentProblem}
            profile={profile}
            lives={lives}
            maxLives={MAX_LIVES}
            score={score}
            combo={combo}
            stageConfig={currentStageConfig}
            stageProgress={stageProgress}
            requiredQuestions={currentStageConfig.requiredQuestions}
            activeBuffs={activeBuffs}
            isPaused={isPaused}
            onTogglePause={() => setIsPaused((prev) => !prev)}
            onToggleSound={() => {
              const next = !profile.soundEnabled;
              soundManager.setSoundMuted(!next);
              setProfile((prev) => ({ ...prev, soundEnabled: next }));
            }}
            onOpenHint={() => setShowHintModal(true)}
            onExitGame={() => setGameState('start')}
            onJoystickChange={setJoystickInput}
          />
        </div>
      )}

      {/* 3. Stage Clear Screen */}
      {gameState === 'stageClear' && (
        <StageClearModal
          stageConfig={currentStageConfig}
          profile={profile}
          score={score}
          stageScore={stageScore}
          maxCombo={maxCombo}
          accuracy={accuracy}
          isLastStage={currentStage >= STAGE_CONFIGS.length}
          onNextStage={proceedToNextStage}
          onReplayStage={replayCurrentStage}
          onReturnToTitle={() => setGameState('start')}
        />
      )}

      {/* 4. Game Over Screen */}
      {gameState === 'gameOver' && (
        <GameOverModal
          profile={profile}
          score={score}
          stage={currentStage}
          wrongReviews={wrongReviews}
          onRetry={replayCurrentStage}
          onReturnToTitle={() => setGameState('start')}
          onOpenConceptGuide={() => setShowConceptGuide(true)}
        />
      )}

      {/* Auxiliary Modals */}
      {showConceptGuide && (
        <MathConceptModal onClose={() => setShowConceptGuide(false)} />
      )}

      {showHintModal && currentProblem && (
        <HintModal
          problem={currentProblem}
          onClose={() => setShowHintModal(false)}
        />
      )}

      {showHallOfFame && (
        <HallOfFameModal
          records={scoreRecords}
          onClose={() => setShowHallOfFame(false)}
          onClearRecords={clearScoreRecords}
        />
      )}
    </div>
  );
}
