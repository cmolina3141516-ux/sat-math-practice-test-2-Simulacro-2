export interface Question {
  id: number;
  module: number;
  text: string;
  passage?: string;
  image?: string;
  options: string[];
  correctAnswer: string;
}

export interface Student {
  name: string;
}

export interface ExamState {
  currentModule: number;
  currentQuestion: number;
  answers: Record<string, string>;
  timeRemaining: number;
  isActive: boolean;
  isCompleted: boolean;
  student: Student | null;
}
