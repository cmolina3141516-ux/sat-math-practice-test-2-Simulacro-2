import { useMemo, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, CheckCircle2, Circle, FileText, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Timer } from '@/components/Timer';
import { type MathModuleDefinition, type ModuleAnswers } from '@/data/mathExam';

interface MathExamPageProps {
  module: MathModuleDefinition;
  studentName: string;
  onComplete: (answers: ModuleAnswers) => void;
  onTimeUp: (answers: ModuleAnswers) => void;
}

export function MathExamPage({ module, studentName, onComplete, onTimeUp }: MathExamPageProps) {
  const [answers, setAnswers] = useState<ModuleAnswers>({});
  const [selectedQuestion, setSelectedQuestion] = useState(module.questions[0].id);
  const [isTimerActive, setIsTimerActive] = useState(true);
  const hasAutoSubmitted = useRef(false);

  const answeredCount = useMemo(
    () => module.questions.filter((question) => answers[question.id]?.trim()).length,
    [answers, module.questions]
  );
  const isModuleComplete = answeredCount === module.questions.length;

  const selectedQuestionDefinition = module.questions.find((question) => question.id === selectedQuestion) ?? module.questions[0];
  const selectedQuestionIndex = module.questions.findIndex((question) => question.id === selectedQuestion);

  const handleQuestionFocus = (questionId: number) => {
    const question = module.questions.find((item) => item.id === questionId);
    if (!question) {
      return;
    }
    setSelectedQuestion(question.id);
  };

  const moveQuestion = (direction: -1 | 1) => {
    const nextIndex = Math.min(module.questions.length - 1, Math.max(0, selectedQuestionIndex + direction));
    setSelectedQuestion(module.questions[nextIndex].id);
  };

  const finishModule = (nextAnswers: ModuleAnswers) => {
    if (hasAutoSubmitted.current) {
      return;
    }

    hasAutoSubmitted.current = true;
    setIsTimerActive(false);
    onComplete(nextAnswers);
  };

  const updateAnswer = (questionId: number, value: string) => {
    setAnswers((current) => ({
      ...current,
      [questionId]: value,
    }));
  };

  const submitModule = () => {
    if (!window.confirm(`Submit ${module.title}? You will not be able to return to this module.`)) {
      return;
    }
    finishModule(answers);
  };

  const handleTimeUp = () => {
    setIsTimerActive(false);
    onTimeUp(answers);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <header className="sticky top-0 z-20 border-b border-slate-800 bg-slate-950/95 backdrop-blur">
        <div className="mx-auto flex max-w-[1500px] flex-col gap-4 px-4 py-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-sky-300">SAT Math Practice Test 2</p>
            <h1 className="mt-1 text-2xl font-semibold">
              {module.title} <span className="text-slate-400">- {studentName}</span>
            </h1>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="rounded-xl border border-slate-800 bg-slate-900 px-4 py-3 text-sm text-slate-300">
              {answeredCount} / {module.questions.length} answered
            </div>
            <Timer initialSeconds={module.durationSeconds} onTimeUp={handleTimeUp} isActive={isTimerActive} />
          </div>
        </div>
      </header>

      <main className="mx-auto grid max-w-[1500px] gap-4 px-4 py-4 lg:grid-cols-[minmax(0,1.45fr)_430px]">
        <section className="rounded-[1.75rem] border border-slate-800 bg-slate-900/80 p-4 shadow-2xl">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-950 px-4 py-2 text-sm text-slate-300">
              <FileText className="h-4 w-4 text-sky-300" />
              Question {selectedQuestionDefinition.id} of {module.questions.length}
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={() => moveQuestion(-1)}
                disabled={selectedQuestionIndex === 0}
                className="border-slate-700 bg-slate-950 text-slate-100 hover:bg-slate-800"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Previous
              </Button>
              <Button
                variant="outline"
                onClick={() => moveQuestion(1)}
                disabled={selectedQuestionIndex === module.questions.length - 1}
                className="border-slate-700 bg-slate-950 text-slate-100 hover:bg-slate-800"
              >
                Next
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="max-h-[560px] min-h-[360px] overflow-auto rounded-[1.5rem] border border-slate-800 bg-white shadow-inner">
            <img
              src={selectedQuestionDefinition.imagePath}
              alt={`${module.title} question ${selectedQuestionDefinition.id}`}
              className="mx-auto h-auto w-full max-w-[760px]"
            />
          </div>

          <div className="mt-4 rounded-[1.25rem] border border-slate-800 bg-slate-950 p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-sky-300">Your Answer</p>
                <h2 className="mt-2 text-2xl font-semibold">Question {selectedQuestionDefinition.id}</h2>
                <p className="mt-1 text-sm text-slate-400">PDF page: {selectedQuestionDefinition.pdfPage}</p>
              </div>
              {answers[selectedQuestionDefinition.id]?.trim() ? (
                <CheckCircle2 className="h-6 w-6 text-emerald-400" />
              ) : (
                <Circle className="h-6 w-6 text-slate-600" />
              )}
            </div>

            {selectedQuestionDefinition.kind === 'choice' ? (
              <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {(['A', 'B', 'C', 'D'] as const).map((choice) => {
                  const active = answers[selectedQuestionDefinition.id] === choice;
                  return (
                    <button
                      key={choice}
                      type="button"
                      onClick={() => updateAnswer(selectedQuestionDefinition.id, choice)}
                      className={`min-h-14 rounded-xl border px-4 py-3 text-center text-base font-semibold transition ${
                        active
                          ? 'border-sky-400 bg-sky-400 text-slate-950'
                          : 'border-slate-700 bg-slate-900 text-slate-100 hover:border-slate-500'
                      }`}
                    >
                      Choice {choice}
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="mt-5 space-y-3">
                <label className="text-sm font-medium text-slate-300" htmlFor={`grid-${selectedQuestionDefinition.id}`}>
                  Open response
                </label>
                <Input
                  id={`grid-${selectedQuestionDefinition.id}`}
                  value={answers[selectedQuestionDefinition.id] ?? ''}
                  onChange={(event) => updateAnswer(selectedQuestionDefinition.id, event.target.value)}
                  placeholder="Number, decimal, or fraction"
                  className="h-12 border-slate-700 bg-slate-900 text-slate-50 placeholder:text-slate-500"
                />
                <p className="text-xs leading-5 text-slate-500">
                  {selectedQuestionDefinition.answerHint ??
                    'Fractions and equivalent decimals are accepted for open responses.'}
                </p>
              </div>
            )}

            {isModuleComplete && (
              <Button
                onClick={() => finishModule(answers)}
                className="mt-5 h-12 w-full rounded-xl bg-emerald-400 text-base font-semibold text-slate-950 hover:bg-emerald-300"
              >
                <Send className="mr-2 h-4 w-4" />
                {module.id === 1 ? 'Submit Module 1 and Continue' : 'Submit Module 2 and Finish'}
              </Button>
            )}
          </div>
        </section>

        <aside className="rounded-[1.75rem] border border-slate-800 bg-slate-900/85 p-4 shadow-2xl">
          <div className="rounded-[1.5rem] border border-slate-800 bg-slate-950 p-4">
            <p className="text-xs uppercase tracking-[0.24em] text-sky-300">Answer Sheet</p>
            <h2 className="mt-2 text-xl font-semibold text-slate-50">Question navigation</h2>

            <div className="mt-5 grid grid-cols-5 gap-2">
              {module.questions.map((question) => {
                const isAnswered = Boolean(answers[question.id]?.trim());
                const isSelected = question.id === selectedQuestion;
                return (
                  <button
                    key={question.id}
                    type="button"
                    onClick={() => handleQuestionFocus(question.id)}
                    className={`rounded-xl border px-3 py-3 text-sm font-medium transition ${
                      isSelected
                        ? 'border-sky-400 bg-sky-400 text-slate-950'
                        : isAnswered
                          ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-200'
                          : 'border-slate-700 bg-slate-900 text-slate-300 hover:border-slate-500'
                    }`}
                  >
                    <span className="block">Q{question.id}</span>
                    <span className="mt-1 block text-[10px] uppercase tracking-[0.16em]">
                      {question.kind === 'choice' ? 'ABCD' : 'OPEN'}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <Button
            onClick={submitModule}
            className="mt-4 h-12 w-full rounded-2xl bg-emerald-400 text-base font-semibold text-slate-950 hover:bg-emerald-300"
          >
            <Send className="mr-2 h-4 w-4" />
            {module.id === 1 ? 'Submit Module 1 and Continue' : 'Submit Module 2 and Finish'}
          </Button>
        </aside>
      </main>
    </div>
  );
}
