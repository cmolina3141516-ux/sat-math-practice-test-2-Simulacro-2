import { Trophy, RotateCcw, Download, DatabaseZap, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  type MathModuleDefinition,
  type ModuleAnswers,
  correctAnswerLabel,
  isQuestionCorrect,
} from '@/data/mathExam';

interface MathResultsPageProps {
  studentName: string;
  module1: MathModuleDefinition;
  module2: MathModuleDefinition;
  module1Answers: ModuleAnswers;
  module2Answers: ModuleAnswers;
  results: {
    module1Score: { correct: number; answered: number; total: number; percentage: number };
    module2Score: { correct: number; answered: number; total: number; percentage: number };
    totalCorrect: number;
    totalQuestions: number;
    percentage: number;
    satEstimate: { score: number; min: number; max: number };
  };
  saveStatus: { saved: boolean; skipped: boolean; error?: string } | null;
  onRestart: () => void;
}

function downloadCsv(
  studentName: string,
  module1: MathModuleDefinition,
  module2: MathModuleDefinition,
  module1Answers: ModuleAnswers,
  module2Answers: ModuleAnswers
) {
  const rows = [
    ['module', 'question', 'answer', 'correct'],
    ...module1.questions.map((question) => [
      '1',
      String(question.id),
      module1Answers[question.id] ?? '',
      correctAnswerLabel(question),
    ]),
    ...module2.questions.map((question) => [
      '2',
      String(question.id),
      module2Answers[question.id] ?? '',
      correctAnswerLabel(question),
    ]),
  ];

  const csv = rows.map((row) => row.map((cell) => `"${cell.replaceAll('"', '""')}"`).join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `sat-math-results-${studentName.trim().replace(/\s+/g, '-').toLowerCase() || 'student'}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function MathResultsPage({
  studentName,
  module1,
  module2,
  module1Answers,
  module2Answers,
  results,
  saveStatus,
  onRestart,
}: MathResultsPageProps) {
  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,_#020617_0%,_#0f172a_50%,_#e2e8f0_100%)] px-6 py-10 text-slate-50">
      <div className="mx-auto max-w-6xl">
        <section className="rounded-[2rem] border border-slate-800 bg-slate-950/85 p-8 shadow-[0_30px_80px_-35px_rgba(14,165,233,0.35)] backdrop-blur">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-sky-400 text-slate-950">
                <Trophy className="h-8 w-8" />
              </div>
              <h1 className="mt-5 text-4xl font-semibold">Math practice complete</h1>
              <p className="mt-3 max-w-2xl text-lg text-slate-300">
                {studentName} finished both modules with {results.totalCorrect} correct answers out of {results.totalQuestions}.
              </p>
            </div>

            <div className="rounded-[1.75rem] border border-slate-800 bg-slate-900 p-6 text-center">
              <p className="text-xs uppercase tracking-[0.24em] text-sky-300">Estimated SAT Math</p>
              <div className="mt-3 text-6xl font-semibold text-white">{results.satEstimate.score}</div>
              <p className="mt-2 text-sm text-slate-400">
                Range: {results.satEstimate.min} - {results.satEstimate.max}
              </p>
            </div>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <Card className="border-slate-800 bg-slate-900 text-slate-50 shadow-none">
              <CardHeader>
                <CardTitle>Module 1</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-slate-300">
                <div className="text-4xl font-semibold text-white">
                  {results.module1Score.correct}/{results.module1Score.total}
                </div>
                <p>{results.module1Score.answered} answered</p>
                <p>{results.module1Score.percentage}% correct</p>
              </CardContent>
            </Card>
            <Card className="border-slate-800 bg-slate-900 text-slate-50 shadow-none">
              <CardHeader>
                <CardTitle>Module 2</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-slate-300">
                <div className="text-4xl font-semibold text-white">
                  {results.module2Score.correct}/{results.module2Score.total}
                </div>
                <p>{results.module2Score.answered} answered</p>
                <p>{results.module2Score.percentage}% correct</p>
              </CardContent>
            </Card>
          </div>

          <div
            className={`mt-6 rounded-2xl border p-4 text-sm ${
              saveStatus?.saved
                ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-100'
                : saveStatus?.error
                  ? 'border-rose-500/30 bg-rose-500/10 text-rose-100'
                  : 'border-amber-400/30 bg-amber-400/10 text-amber-100'
            }`}
          >
            <div className="flex items-start gap-3">
              {saveStatus?.saved ? <DatabaseZap className="mt-0.5 h-5 w-5" /> : <AlertTriangle className="mt-0.5 h-5 w-5" />}
              <div>
                <p className="font-semibold">
                  {saveStatus?.saved
                    ? 'Results saved to Google Sheets'
                    : saveStatus?.error
                      ? 'Results could not be saved'
                      : 'Results were scored locally'}
                </p>
                <p className="mt-1 leading-6">
                  {saveStatus?.saved
                    ? 'The attempt was sent successfully to the configured Apps Script endpoint.'
                    : saveStatus?.error
                      ? saveStatus.error
                      : 'To save attempts automatically, set VITE_GOOGLE_SHEETS_WEB_APP_URL after deploying the Apps Script Web App.'}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button
              onClick={() => downloadCsv(studentName, module1, module2, module1Answers, module2Answers)}
              className="h-12 rounded-2xl bg-sky-500 text-slate-950 hover:bg-sky-400"
            >
              <Download className="mr-2 h-4 w-4" />
              Download CSV
            </Button>
            <Button
              variant="outline"
              onClick={onRestart}
              className="h-12 rounded-2xl border-slate-700 bg-slate-950 text-slate-50 hover:bg-slate-800"
            >
              <RotateCcw className="mr-2 h-4 w-4" />
              Restart test
            </Button>
          </div>
        </section>

        <section className="mt-6 grid gap-6 lg:grid-cols-2">
          {[module1, module2].map((module, index) => {
            const answers = index === 0 ? module1Answers : module2Answers;
            return (
              <Card key={module.id} className="border-slate-300 bg-white/90 text-slate-950 shadow-xl">
                <CardHeader>
                  <CardTitle>{module.title} answer review</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-6 gap-2">
                    {module.questions.map((question) => {
                      const isCorrect = isQuestionCorrect(question, answers[question.id]);
                      const isAnswered = Boolean(answers[question.id]?.trim());
                      return (
                        <div
                          key={question.id}
                          className={`rounded-xl border px-2 py-3 text-center text-sm font-semibold ${
                            isAnswered
                              ? isCorrect
                                ? 'border-emerald-300 bg-emerald-100 text-emerald-900'
                                : 'border-rose-300 bg-rose-100 text-rose-900'
                              : 'border-slate-300 bg-slate-100 text-slate-500'
                          }`}
                          title={`Q${question.id}`}
                        >
                          Q{question.id}
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </section>
      </div>
    </div>
  );
}
