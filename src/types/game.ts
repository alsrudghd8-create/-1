/**
 * Types and interfaces for Space Bear Fraction Game (초등 4학년 2학기 분수)
 */

export interface Fraction {
  whole: number; // 대분수의 자연수 부분 (진분수인 경우 0)
  numerator: number; // 분자
  denominator: number; // 분모
}

export type OperationType = '+' | '-';

export interface FractionProblem {
  id: string;
  stage: number;
  stageName: string;
  operation: OperationType;
  operand1: Fraction;
  operand2: Fraction;
  operand3?: Fraction; // 3개 분수 연산용
  operation2?: OperationType;
  answer: Fraction;
  improperAnswer?: Fraction; // 가분수 형태 정답
  options: Fraction[]; // 3~4개의 보기 (정답 1개 + 매력적인 오답들)
  explanation: string; // 친절한 4학년 눈높이 풀이 과정
  difficultyText: string;
}

export type ItemType = 
  | 'heart'       // 💖 생명 회복 (+1 하트)
  | 'shield'      // 🛡️ 우주 쉴드 (오답 1회 방어)
  | 'magnet'      // 🧲 별빛 자석 (정답이 곰돌이에게 끌려옴)
  | 'freeze'      // ⏱️ 시간 정지/슬로우 (오답 및 유성 속도 대폭 감속)
  | 'bomb'        // 💣 오답 파괴 (현재 화면의 오답들을 별가루로 폭파)
  | 'doubleStar'  // 🌟 2배 점수 (8초간 점수 2배)
  | 'hint';       // 💡 정답 레이더 (정답 궤도에 황금 오라 표시)

export interface SpaceItem {
  id: string;
  type: ItemType;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  icon: string;
  name: string;
  color: string;
  createdAt: number;
  duration: number; // 화면 잔존 시간
}

export interface FloatingOrb {
  id: string;
  fraction: Fraction;
  isCorrect: boolean;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  pulsePhase: number;
  isHinted?: boolean;
}

export interface SpaceObstacle {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  rotation: number;
  rotSpeed: number;
  type: 'meteor' | 'alien' | 'junk';
}

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  alpha: number;
  life: number;
  maxLife: number;
  text?: string;
}

export type BearSkin = 'classic' | 'polar' | 'panda' | 'honey' | 'galaxy';

export interface BearSkinInfo {
  id: BearSkin;
  name: string;
  description: string;
  suitColor: string;
  visorColor: string;
  earColor: string;
  accentColor: string;
  speedBonus: number;
}

export interface PlayerProfile {
  studentNumber: string; // 학번/출석번호
  studentName: string;   // 학생 이름
  skin: BearSkin;
  soundEnabled: boolean;
  bgmEnabled: boolean;
}

export interface ActiveBuffs {
  shield: boolean;
  magnetUntil: number;
  freezeUntil: number;
  doubleStarUntil: number;
  hintUntil: number;
}

export interface StageConfig {
  stage: number;
  title: string;
  subtitle: string;
  description: string;
  requiredQuestions: number;
  speedMultiplier: number;
  meteorRate: number;
  themeColor: string;
  bgNebulaColor: string;
}

export interface GameScoreRecord {
  id: string;
  studentNumber: string;
  studentName: string;
  score: number;
  maxCombo: number;
  stageReached: number;
  date: string;
  accuracy: number;
}

export interface WrongQuestionReview {
  problem: FractionProblem;
  selectedWrongAnswer: Fraction;
  timestamp: number;
}
