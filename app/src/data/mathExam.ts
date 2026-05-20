export type QuestionKind = 'choice' | 'grid';

export interface MathQuestionDefinition {
  id: number;
  module: 1 | 2;
  kind: QuestionKind;
  pdfPage: number;
  imagePath: string;
  answerHint?: string;
  correctChoice?: 'A' | 'B' | 'C' | 'D';
  acceptedNumericAnswers?: number[];
  acceptedAnswerSets?: number[][];
}

export interface MathModuleDefinition {
  id: 1 | 2;
  title: string;
  durationSeconds: number;
  questions: MathQuestionDefinition[];
}

export type ModuleAnswers = Record<number, string>;

const imagePath = (module: 1 | 2, id: number) =>
  `/math/simulacro2/module${module}/q${String(id).padStart(2, '0')}.png`;

const choice = (
  module: 1 | 2,
  id: number,
  pdfPage: number,
  correctChoice: 'A' | 'B' | 'C' | 'D'
): MathQuestionDefinition => ({
  module,
  id,
  pdfPage,
  imagePath: imagePath(module, id),
  kind: 'choice',
  correctChoice,
});

const grid = (
  module: 1 | 2,
  id: number,
  pdfPage: number,
  acceptedNumericAnswers: number[],
  answerHint?: string,
  acceptedAnswerSets?: number[][]
): MathQuestionDefinition => ({
  module,
  id,
  pdfPage,
  imagePath: imagePath(module, id),
  kind: 'grid',
  answerHint,
  acceptedNumericAnswers,
  acceptedAnswerSets,
});

export const mathModules: MathModuleDefinition[] = [
  {
    id: 1,
    title: 'Module 1',
    durationSeconds: 35 * 60,
    questions: [
      choice(1, 1, 1, 'B'),
      choice(1, 2, 1, 'C'),
      choice(1, 3, 1, 'B'),
      choice(1, 4, 1, 'A'),
      choice(1, 5, 1, 'A'),
      grid(1, 6, 1, [9]),
      grid(1, 7, 2, [224]),
      choice(1, 8, 2, 'A'),
      choice(1, 9, 2, 'C'),
      choice(1, 10, 2, 'B'),
      choice(1, 11, 3, 'A'),
      choice(1, 12, 3, 'B'),
      grid(1, 13, 3, [40]),
      grid(1, 14, 3, [14]),
      choice(1, 15, 3, 'C'),
      choice(1, 16, 4, 'D'),
      choice(1, 17, 4, 'B'),
      choice(1, 18, 4, 'D'),
      choice(1, 19, 4, 'D'),
      grid(1, 20, 4, [52]),
      grid(1, 21, 5, [-3]),
      choice(1, 22, 5, 'B'),
    ],
  },
  {
    id: 2,
    title: 'Module 2',
    durationSeconds: 35 * 60,
    questions: [
      choice(2, 1, 1, 'B'),
      choice(2, 2, 1, 'B'),
      choice(2, 3, 1, 'D'),
      choice(2, 4, 1, 'B'),
      choice(2, 5, 2, 'D'),
      grid(2, 6, 2, [70]),
      grid(2, 7, 2, [1]),
      choice(2, 8, 2, 'D'),
      choice(2, 9, 3, 'A'),
      choice(2, 10, 3, 'D'),
      choice(2, 11, 3, 'C'),
      choice(2, 12, 3, 'D'),
      grid(2, 13, 4, [45]),
      grid(2, 14, 4, [2, -12], 'Enter both solutions separated by a semicolon, with no spaces.', [[2, -12]]),
      choice(2, 15, 4, 'B'),
      choice(2, 16, 4, 'C'),
      choice(2, 17, 4, 'B'),
      choice(2, 18, 5, 'B'),
      choice(2, 19, 5, 'C'),
      grid(2, 20, 5, [410]),
      grid(2, 21, 5, [-19]),
      choice(2, 22, 6, 'D'),
    ],
  },
];

const numericTolerance = 0.01;

export function parseNumericAnswer(value: string): number | null {
  const trimmed = value.trim().replace(',', '');
  if (!trimmed) {
    return null;
  }

  if (/^-?\d+\/-?\d+$/.test(trimmed)) {
    const [numeratorText, denominatorText] = trimmed.split('/');
    const numerator = Number(numeratorText);
    const denominator = Number(denominatorText);
    if (!Number.isFinite(numerator) || !Number.isFinite(denominator) || denominator === 0) {
      return null;
    }
    return numerator / denominator;
  }

  const parsed = Number(trimmed);
  return Number.isFinite(parsed) ? parsed : null;
}

function parseNumericAnswers(value: string): number[] {
  return value
    .split(/[;,]/)
    .map((part) => parseNumericAnswer(part))
    .filter((parsed): parsed is number => parsed !== null);
}

export function correctAnswerLabel(question: MathQuestionDefinition) {
  if (question.kind === 'choice') {
    return question.correctChoice ?? '';
  }

  return question.acceptedNumericAnswers?.join(' or ') ?? '';
}

export function isQuestionCorrect(question: MathQuestionDefinition, answer?: string): boolean {
  if (!answer?.trim()) {
    return false;
  }

  if (question.kind === 'choice') {
    return answer.trim().toUpperCase() === question.correctChoice;
  }

  const numericAnswer = parseNumericAnswer(answer);
  const answerSet = parseNumericAnswers(answer);

  if (question.acceptedAnswerSets?.length) {
    return question.acceptedAnswerSets.some((acceptedSet) => {
      if (acceptedSet.length !== answerSet.length) {
        return false;
      }

      return acceptedSet.every((accepted) =>
        answerSet.some((provided) => Math.abs(accepted - provided) <= numericTolerance)
      );
    });
  }

  if (numericAnswer === null) {
    return false;
  }

  return (question.acceptedNumericAnswers ?? []).some(
    (accepted) => Math.abs(accepted - numericAnswer) <= numericTolerance
  );
}

export function calculateModuleScore(module: MathModuleDefinition, answers: ModuleAnswers) {
  const correct = module.questions.reduce((count, question) => {
    return count + (isQuestionCorrect(question, answers[question.id]) ? 1 : 0);
  }, 0);

  const answered = module.questions.reduce((count, question) => {
    return count + (answers[question.id]?.trim() ? 1 : 0);
  }, 0);

  return {
    correct,
    answered,
    total: module.questions.length,
    percentage: Math.round((correct / module.questions.length) * 100),
  };
}

export function calculateSatMathEstimate(correct: number, total: number) {
  const percentage = total === 0 ? 0 : correct / total;
  const score = Math.round(200 + percentage * 600);
  return {
    score,
    min: Math.max(200, score - 40),
    max: Math.min(800, score + 40),
  };
}
