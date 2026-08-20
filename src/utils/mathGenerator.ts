/**
 * 4학년 2학기 분수의 덧셈과 뺄셈 교육과정 기반 문제 및 매력적인 오답 생성기
 */

import { Fraction, FractionProblem, StageConfig, BearSkinInfo } from '../types/game';

// 4학년 2학기 주요 분모 (3, 4, 5, 6, 7, 8, 9, 10, 12)
const STANDARD_DENOMINATORS = [4, 5, 6, 7, 8, 9, 10, 12];

export const STAGE_CONFIGS: StageConfig[] = [
  {
    stage: 1,
    title: '1단계: 분모가 같은 진분수의 덧셈 & 뺄셈',
    subtitle: '기초 우주 비행 훈련',
    description: '분모가 같을 때는 분자끼리 더하거나 뺍니다. 분모는 그대로 둡니다!',
    requiredQuestions: 5,
    speedMultiplier: 1.0,
    meteorRate: 0,
    themeColor: '#38bdf8', // sky-400
    bgNebulaColor: 'rgba(14, 165, 233, 0.15)',
  },
  {
    stage: 2,
    title: '2단계: 합이 1보다 큰 진분수의 덧셈',
    subtitle: '가분수를 대분수로 변신!',
    description: '진분수끼리 더해서 가분수가 되면, 1과 몇 분의 몇(대분수)으로 바꿔줍니다.',
    requiredQuestions: 5,
    speedMultiplier: 1.15,
    meteorRate: 0.2,
    themeColor: '#818cf8', // indigo-400
    bgNebulaColor: 'rgba(99, 102, 241, 0.18)',
  },
  {
    stage: 3,
    title: '3단계: 자연수와 분수의 뺄셈',
    subtitle: '자연수를 분수로 바꾸는 마법',
    description: '1은 분모와 분자가 같은 분수로 바꿉니다. (예: 1 = 5/5, 3 = 2와 5/5)',
    requiredQuestions: 6,
    speedMultiplier: 1.25,
    meteorRate: 0.35,
    themeColor: '#c084fc', // purple-400
    bgNebulaColor: 'rgba(168, 85, 247, 0.2)',
  },
  {
    stage: 4,
    title: '4단계: 대분수의 덧셈 (받아올림 포함)',
    subtitle: '자연수는 자연수끼리, 분수는 분수끼리!',
    description: '분수끼리 더해서 1이 넘으면 자연수에 1을 올려줍니다.',
    requiredQuestions: 6,
    speedMultiplier: 1.35,
    meteorRate: 0.5,
    themeColor: '#fb7185', // rose-400
    bgNebulaColor: 'rgba(244, 63, 94, 0.22)',
  },
  {
    stage: 5,
    title: '5단계: 대분수의 뺄셈 (받아내림 포함)',
    subtitle: '자연수에서 1을 빌려와 분수로!',
    description: '분자끼리 뺄 수 없을 때는 자연수에서 1을 빌려와 가분수로 만들어 뺍니다.',
    requiredQuestions: 7,
    speedMultiplier: 1.45,
    meteorRate: 0.65,
    themeColor: '#f59e0b', // amber-500
    bgNebulaColor: 'rgba(245, 158, 11, 0.25)',
  },
  {
    stage: 6,
    title: '6단계: 우주 마스터 분수 혼합 챌린지',
    subtitle: '은하계 최고 분수 비행사 도전!',
    description: '모든 분수의 덧셈과 뺄셈, 3개의 분수 혼합 계산이 출제됩니다!',
    requiredQuestions: 8,
    speedMultiplier: 1.6,
    meteorRate: 0.8,
    themeColor: '#34d399', // emerald-400
    bgNebulaColor: 'rgba(52, 211, 153, 0.28)',
  },
];

// 랜덤 정수
function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// 분수 비교 헬퍼
export function areFractionsEqual(a: Fraction, b: Fraction): boolean {
  return a.whole === b.whole && a.numerator === b.numerator && a.denominator === b.denominator;
}

// 분수를 문자열로 표시
export function formatFraction(f: Fraction): string {
  if (f.whole > 0) {
    if (f.numerator === 0) return `${f.whole}`;
    return `${f.whole}과 ${f.numerator}/${f.denominator}`;
  }
  if (f.numerator === 0) return `0`;
  return `${f.numerator}/${f.denominator}`;
}

// 분수 값 계산
export function fractionToValue(f: Fraction): number {
  return f.whole + f.numerator / f.denominator;
}

// 대분수 정규화 (가분수가 된 부분을 대분수로)
export function normalizeFraction(whole: number, num: number, den: number): Fraction {
  if (den <= 0) return { whole: 0, numerator: 0, denominator: 1 };
  let w = whole;
  let n = num;
  if (n >= den) {
    const extraWhole = Math.floor(n / den);
    w += extraWhole;
    n = n % den;
  }
  return { whole: w, numerator: n, denominator: den };
}

/**
 * 4학년 2학기 각 스테이지별 분수 문제 생성기
 */
export function generateProblem(stageNumber: number): FractionProblem {
  const currentStage = Math.min(Math.max(stageNumber, 1), 6);
  const den = STANDARD_DENOMINATORS[randInt(0, STANDARD_DENOMINATORS.length - 1)];
  const id = `prob_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

  let p: FractionProblem;

  switch (currentStage) {
    case 1:
      p = generateStage1Problem(id, den);
      break;
    case 2:
      p = generateStage2Problem(id, den);
      break;
    case 3:
      p = generateStage3Problem(id, den);
      break;
    case 4:
      p = generateStage4Problem(id, den);
      break;
    case 5:
      p = generateStage5Problem(id, den);
      break;
    case 6:
    default:
      // 혼합 챌린지
      const subType = randInt(1, 5);
      if (subType === 1) p = generateStage1Problem(id, den);
      else if (subType === 2) p = generateStage2Problem(id, den);
      else if (subType === 3) p = generateStage3Problem(id, den);
      else if (subType === 4) p = generateStage4Problem(id, den);
      else p = generateStage5Problem(id, den);
      p.stage = 6;
      p.stageName = '우주 마스터 챌린지';
      break;
  }

  return p;
}

/**
 * Stage 1: 분모가 같은 진분수의 덧셈 / 뺄셈 (합이 1 미만)
 */
function generateStage1Problem(id: string, den: number): FractionProblem {
  const isAdd = Math.random() > 0.45;

  if (isAdd) {
    // 덧셈 (합이 진분수)
    const n1 = randInt(1, den - 2);
    const n2 = randInt(1, den - 1 - n1);
    const ansNum = n1 + n2;

    const op1: Fraction = { whole: 0, numerator: n1, denominator: den };
    const op2: Fraction = { whole: 0, numerator: n2, denominator: den };
    const ans: Fraction = { whole: 0, numerator: ansNum, denominator: den };

    // 매력적인 오답들 생성 (예: 분모끼리 더한 분수, 분자 뺄셈한 분수, 오차 +/-1)
    const dist1: Fraction = { whole: 0, numerator: ansNum, denominator: den * 2 }; // 분모까지 더하는 흔한 실수
    const dist2: Fraction = { whole: 0, numerator: Math.max(1, ansNum - 1), denominator: den };
    const dist3: Fraction = { whole: 0, numerator: Math.min(den - 1, ansNum + 1), denominator: den };

    const options = shuffleOptions(ans, [dist1, dist2, dist3]);

    return {
      id,
      stage: 1,
      stageName: '진분수의 덧셈과 뺄셈',
      operation: '+',
      operand1: op1,
      operand2: op2,
      answer: ans,
      options,
      difficultyText: '★☆☆☆☆',
      explanation: `분모가 같은 진분수의 덧셈은 분모(${den})는 그대로 두고, 분자끼리 더합니다: ${n1} + ${n2} = ${ansNum}이므로 정답은 ${ansNum}/${den}입니다.`,
    };
  } else {
    // 뺄셈
    const ansNum = randInt(1, den - 2);
    const n2 = randInt(1, den - 1 - ansNum);
    const n1 = ansNum + n2;

    const op1: Fraction = { whole: 0, numerator: n1, denominator: den };
    const op2: Fraction = { whole: 0, numerator: n2, denominator: den };
    const ans: Fraction = { whole: 0, numerator: ansNum, denominator: den };

    const dist1: Fraction = { whole: 0, numerator: n1 + n2, denominator: den }; // 더해버린 오답
    const dist2: Fraction = { whole: 0, numerator: Math.max(1, ansNum - 1), denominator: den };
    const dist3: Fraction = { whole: 0, numerator: ansNum, denominator: den * 2 }; // 분모도 뺀 것 방지

    const options = shuffleOptions(ans, [dist1, dist2, dist3]);

    return {
      id,
      stage: 1,
      stageName: '진분수의 덧셈과 뺄셈',
      operation: '-',
      operand1: op1,
      operand2: op2,
      answer: ans,
      options,
      difficultyText: '★☆☆☆☆',
      explanation: `분모가 같은 진분수의 뺄셈은 분모(${den})는 그대로 두고, 분자끼리 뺍니다: ${n1} - ${n2} = ${ansNum}이므로 정답은 ${ansNum}/${den}입니다.`,
    };
  }
}

/**
 * Stage 2: 합이 1보다 큰 진분수의 덧셈 (가분수 -> 대분수 변환)
 */
function generateStage2Problem(id: string, den: number): FractionProblem {
  const n1 = randInt(Math.ceil(den / 2), den - 1);
  const n2 = randInt(den - n1 + 1, den - 1);
  const sumNum = n1 + n2;
  const remNum = sumNum % den;
  const whole = Math.floor(sumNum / den); // 보통 1

  const op1: Fraction = { whole: 0, numerator: n1, denominator: den };
  const op2: Fraction = { whole: 0, numerator: n2, denominator: den };
  const ans: Fraction = { whole, numerator: remNum, denominator: den };

  // 오답들: 가분수 그대로 둔 대분수 변환 실수, 1과 분자 오차, 자연수 2로 잘못 올림
  const dist1: Fraction = { whole: 0, numerator: sumNum, denominator: den * 2 }; // 분모도 더함
  const dist2: Fraction = { whole: 1, numerator: Math.max(1, (remNum + 2) % den), denominator: den };
  const dist3: Fraction = { whole: 2, numerator: remNum, denominator: den }; // 자연수 2로 잘못 올림

  const options = shuffleOptions(ans, [dist1, dist2, dist3]);

  return {
    id,
    stage: 2,
    stageName: '합이 1보다 큰 진분수 덧셈',
    operation: '+',
    operand1: op1,
    operand2: op2,
    answer: ans,
    options,
    difficultyText: '★★☆☆☆',
    explanation: `분자끼리 더하면 ${n1} + ${n2} = ${sumNum}이 되어 가분수 ${sumNum}/${den}이 됩니다. 이를 대분수로 바꾸면 ${sumNum} ÷ ${den} = ${whole}과 나머지 ${remNum}이므로 ${whole}과 ${remNum}/${den}입니다.`,
  };
}

/**
 * Stage 3: 자연수와 분수의 뺄셈 (1 - 진분수, 자연수 - 대분수)
 */
function generateStage3Problem(id: string, den: number): FractionProblem {
  const type = randInt(1, 2);

  if (type === 1) {
    // 1 - 진분수
    const n = randInt(1, den - 1);
    const ansNum = den - n;

    const op1: Fraction = { whole: 1, numerator: 0, denominator: den };
    const op2: Fraction = { whole: 0, numerator: n, denominator: den };
    const ans: Fraction = { whole: 0, numerator: ansNum, denominator: den };

    const dist1: Fraction = { whole: 0, numerator: n, denominator: den }; // 그냥 분자 적음
    const dist2: Fraction = { whole: 1, numerator: ansNum, denominator: den }; // 1 안뺌
    const dist3: Fraction = { whole: 0, numerator: Math.max(1, ansNum - 1), denominator: den };

    const options = shuffleOptions(ans, [dist1, dist2, dist3]);

    return {
      id,
      stage: 3,
      stageName: '자연수와 분수의 뺄셈',
      operation: '-',
      operand1: op1,
      operand2: op2,
      answer: ans,
      options,
      difficultyText: '★★★☆☆',
      explanation: `자연수 1을 분수 ${den}/${den}으로 바꿉니다. ${den}/${den} - ${n}/${den} = ${ansNum}/${den}이 됩니다.`,
    };
  } else {
    // 자연수(2~4) - 대분수(1~2와 몇분의 몇)
    const whole1 = randInt(2, 4);
    const whole2 = randInt(1, whole1 - 1);
    const n = randInt(1, den - 1);

    const op1: Fraction = { whole: whole1, numerator: 0, denominator: den };
    const op2: Fraction = { whole: whole2, numerator: n, denominator: den };

    // whole1 = (whole1 - 1) + den/den
    const ansWhole = whole1 - 1 - whole2;
    const ansNum = den - n;
    const ans: Fraction = { whole: ansWhole, numerator: ansNum, denominator: den };

    const dist1: Fraction = { whole: whole1 - whole2, numerator: ansNum, denominator: den }; // 자연수에서 1 안 깎음
    const dist2: Fraction = { whole: ansWhole, numerator: n, denominator: den }; // 분자 안 뺌
    const dist3: Fraction = { whole: Math.max(0, ansWhole - 1), numerator: ansNum, denominator: den };

    const options = shuffleOptions(ans, [dist1, dist2, dist3]);

    return {
      id,
      stage: 3,
      stageName: '자연수와 분수의 뺄셈',
      operation: '-',
      operand1: op1,
      operand2: op2,
      answer: ans,
      options,
      difficultyText: '★★★☆☆',
      explanation: `자연수 ${whole1}을 (${whole1 - 1}과 ${den}/${den})로 바꾼 뒤 대분수 ${whole2}과 ${n}/${den}을 뺍니다. 자연수는 ${whole1 - 1} - ${whole2} = ${ansWhole}, 분수는 (${den} - ${n})/${den} = ${ansNum}/${den}이 되어 정답은 ${ansWhole > 0 ? `${ansWhole}과 ` : ''}${ansNum}/${den}입니다.`,
    };
  }
}

/**
 * Stage 4: 대분수의 덧셈 (받아올림 있음 / 없음)
 */
function generateStage4Problem(id: string, den: number): FractionProblem {
  const hasCarry = Math.random() > 0.35; // 65% 확률로 받아올림 출제
  const w1 = randInt(1, 3);
  const w2 = randInt(1, 3);

  let n1: number;
  let n2: number;

  if (hasCarry) {
    n1 = randInt(Math.ceil(den / 2), den - 1);
    n2 = randInt(den - n1 + 1, den - 1);
  } else {
    n1 = randInt(1, Math.floor(den / 2));
    n2 = randInt(1, den - 1 - n1);
  }

  const op1: Fraction = { whole: w1, numerator: n1, denominator: den };
  const op2: Fraction = { whole: w2, numerator: n2, denominator: den };

  const rawWhole = w1 + w2;
  const rawNum = n1 + n2;
  const ans = normalizeFraction(rawWhole, rawNum, den);

  // 오답들
  const dist1: Fraction = { whole: rawWhole, numerator: rawNum % den, denominator: den }; // 받아올림 누락
  const dist2: Fraction = { whole: ans.whole, numerator: Math.max(1, (ans.numerator + 1) % den), denominator: den };
  const dist3: Fraction = { whole: ans.whole + 1, numerator: ans.numerator, denominator: den }; // 과도하게 올림

  const options = shuffleOptions(ans, [dist1, dist2, dist3]);

  return {
    id,
    stage: 4,
    stageName: '대분수의 덧셈',
    operation: '+',
    operand1: op1,
    operand2: op2,
    answer: ans,
    options,
    difficultyText: '★★★★☆',
    explanation: `1. 자연수끼리 더합니다: ${w1} + ${w2} = ${rawWhole}\n2. 분수끼리 더합니다: ${n1}/${den} + ${n2}/${den} = ${rawNum}/${den}${
      hasCarry ? ` = 1과 ${rawNum - den}/${den}\n3. 자연수에 1을 올려주어 ${ans.whole}과 ${ans.numerator}/${den}이 됩니다!` : `\n3. 따라서 정답은 ${ans.whole}과 ${ans.numerator}/${den}입니다.`
    }`,
  };
}

/**
 * Stage 5: 대분수의 뺄셈 (받아내림 있음 - 4학년 2학기 킬러 유형)
 */
function generateStage5Problem(id: string, den: number): FractionProblem {
  const w2 = randInt(1, 2);
  const w1 = w2 + randInt(1, 2);

  // 받아내림: n1 < n2
  const n1 = randInt(1, Math.floor(den / 2));
  const n2 = randInt(n1 + 1, den - 1);

  const op1: Fraction = { whole: w1, numerator: n1, denominator: den };
  const op2: Fraction = { whole: w2, numerator: n2, denominator: den };

  // w1과 n1/den = (w1 - 1)과 (n1 + den)/den
  const borrowedWhole = w1 - 1;
  const borrowedNum = n1 + den;

  const ansWhole = borrowedWhole - w2;
  const ansNum = borrowedNum - n2;
  const ans: Fraction = { whole: ansWhole, numerator: ansNum, denominator: den };

  // 대표적인 학생 오개념 오답:
  // 1. 큰 분자에서 작은 분자를 그냥 빼버림 (n2 - n1)
  const dist1: Fraction = { whole: w1 - w2, numerator: n2 - n1, denominator: den };
  // 2. 자연수에서 1을 빌려왔는데 자연수를 안 깎음
  const dist2: Fraction = { whole: w1 - w2, numerator: ansNum, denominator: den };
  // 3. 분자 오차
  const dist3: Fraction = { whole: ansWhole, numerator: Math.max(1, (ansNum + 1) % den), denominator: den };

  const options = shuffleOptions(ans, [dist1, dist2, dist3]);

  return {
    id,
    stage: 5,
    stageName: '대분수의 뺄셈 (받아내림)',
    operation: '-',
    operand1: op1,
    operand2: op2,
    answer: ans,
    options,
    difficultyText: '★★★★★',
    explanation: `분자(${n1} < ${n2})끼리 뺄 수 없으므로 자연수 ${w1}에서 1을 빌려옵니다.\n${w1}과 ${n1}/${den} = ${borrowedWhole}과 ${borrowedNum}/${den}\n이제 자연수끼리 빼면 ${borrowedWhole} - ${w2} = ${ansWhole}, 분수끼리 빼면 (${borrowedNum} - ${n2})/${den} = ${ansNum}/${den}이 되어 정답은 ${ansWhole > 0 ? `${ansWhole}과 ` : ''}${ansNum}/${den}입니다!`,
  };
}

/**
 * 보기들을 무작위로 섞고 중복 방지
 */
function shuffleOptions(correct: Fraction, distractors: Fraction[]): Fraction[] {
  const uniqueList: Fraction[] = [correct];

  distractors.forEach((d) => {
    // 중복 및 유효성 체크
    const isDup = uniqueList.some((u) => areFractionsEqual(u, d));
    if (!isDup && d.denominator > 0 && d.numerator >= 0) {
      uniqueList.push(d);
    }
  });

  // 혹시 중복 제거 후 4개가 안 되면 대체 생성
  while (uniqueList.length < 4) {
    const fallback: Fraction = {
      whole: correct.whole + (Math.random() > 0.5 ? 1 : 0),
      numerator: ((correct.numerator + uniqueList.length) % (correct.denominator || 5)) + 1,
      denominator: correct.denominator || 5,
    };
    if (!uniqueList.some((u) => areFractionsEqual(u, fallback))) {
      uniqueList.push(fallback);
    } else {
      break;
    }
  }

  // Fisher-Yates shuffle
  for (let i = uniqueList.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [uniqueList[i], uniqueList[j]] = [uniqueList[j], uniqueList[i]];
  }

  return uniqueList;
}

/**
 * 곰돌이 캐릭터 스킨 정보
 */
export const BEAR_SKINS: BearSkinInfo[] = [
  {
    id: 'classic',
    name: '갈색 우주곰',
    description: '호기심 가득한 지구 대표 우주비행 곰돌이!',
    suitColor: '#f8fafc',
    visorColor: '#38bdf8',
    earColor: '#b45309',
    accentColor: '#fbbf24',
    speedBonus: 0,
  },
  {
    id: 'polar',
    name: '북극 우주곰',
    description: '우주 극한 환경에서도 시원하게 헤엄치는 얼음별 곰!',
    suitColor: '#e0f2fe',
    visorColor: '#06b6d4',
    earColor: '#f1f5f9',
    accentColor: '#38bdf8',
    speedBonus: 0.1,
  },
  {
    id: 'panda',
    name: '판다 탐험가',
    description: '대나무 대신 분수 별사탕을 좋아하는 귀여운 판다!',
    suitColor: '#1e293b',
    visorColor: '#4ade80',
    earColor: '#0f172a',
    accentColor: '#22c55e',
    speedBonus: 0,
  },
  {
    id: 'honey',
    name: '꿀벌 곰돌이',
    description: '달콤한 꿀처럼 정답 분수를 찾아 날아다녀요!',
    suitColor: '#fef08a',
    visorColor: '#f59e0b',
    earColor: '#78350f',
    accentColor: '#eab308',
    speedBonus: 0.15,
  },
  {
    id: 'galaxy',
    name: '은하 히어로곰',
    description: '반짝이는 은하 성운의 힘을 받은 전설의 우주곰!',
    suitColor: '#c084fc',
    visorColor: '#ec4899',
    earColor: '#581c87',
    accentColor: '#a855f7',
    speedBonus: 0.2,
  },
];
