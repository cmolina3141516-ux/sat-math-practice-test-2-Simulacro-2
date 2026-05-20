import { useState } from 'react';
import { Calculator, Clock3, FileSpreadsheet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

interface MathLandingPageProps {
  onStart: (name: string) => void;
}

export function MathLandingPage({ onStart }: MathLandingPageProps) {
  const [studentName, setStudentName] = useState('');

  const handleStart = () => {
    if (!studentName.trim()) {
      return;
    }
    onStart(studentName);
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#e0f2fe,_#f8fafc_42%,_#e2e8f0_100%)] px-6 py-10 text-slate-950">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-8 lg:grid-cols-[1.25fr_0.9fr]">
          <section className="rounded-[2rem] border border-sky-200/70 bg-white/85 p-8 shadow-[0_30px_80px_-40px_rgba(15,23,42,0.35)] backdrop-blur">
            <div className="mb-8 inline-flex items-center gap-3 rounded-full border border-sky-200 bg-sky-50 px-4 py-2 text-sm font-medium text-sky-900">
              <Calculator className="h-4 w-4" />
              SAT Math
            </div>

            <h1 className="max-w-3xl font-serif text-4xl font-semibold tracking-tight text-slate-950 md:text-6xl">
              SAT Math Practice Test 2
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-700">
              The 22 questions in each module come from the original PDFs, with an independent timer and a digital
              answer sheet.
            </p>

            <div className="mt-10 grid gap-4 md:grid-cols-3">
              <Card className="border-slate-200 bg-slate-50/90 shadow-none">
                <CardContent className="p-5">
                  <Clock3 className="mb-3 h-5 w-5 text-sky-700" />
                  <p className="text-sm font-semibold text-slate-900">SAT-style timer</p>
                  <p className="mt-2 text-sm leading-6 text-slate-600">Two 35-minute modules.</p>
                </CardContent>
              </Card>
              <Card className="border-slate-200 bg-slate-50/90 shadow-none">
                <CardContent className="p-5">
                  <Calculator className="mb-3 h-5 w-5 text-sky-700" />
                  <p className="text-sm font-semibold text-slate-900">Original questions</p>
                  <p className="mt-2 text-sm leading-6 text-slate-600">Each question is shown as a crop from the PDF.</p>
                </CardContent>
              </Card>
              <Card className="border-slate-200 bg-slate-50/90 shadow-none">
                <CardContent className="p-5">
                  <FileSpreadsheet className="mb-3 h-5 w-5 text-sky-700" />
                  <p className="text-sm font-semibold text-slate-900">Results</p>
                  <p className="mt-2 text-sm leading-6 text-slate-600">Ready to save attempts in Google Sheets.</p>
                </CardContent>
              </Card>
            </div>
          </section>

          <aside className="rounded-[2rem] border border-slate-200 bg-slate-950 p-8 text-slate-50 shadow-[0_30px_80px_-40px_rgba(15,23,42,0.45)]">
            <h2 className="text-2xl font-semibold">Start the test</h2>
            <p className="mt-3 text-sm leading-6 text-slate-300">
              Enter the student's name to begin Module 1.
            </p>

            <div className="mt-8 space-y-3">
              <label className="text-sm font-medium text-slate-200" htmlFor="student-name">
                Student name
              </label>
              <Input
                id="student-name"
                value={studentName}
                onChange={(event) => setStudentName(event.target.value)}
                placeholder="Full name"
                className="h-12 border-slate-700 bg-slate-900 text-slate-50 placeholder:text-slate-400"
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    handleStart();
                  }
                }}
              />
            </div>

            <Button
              onClick={handleStart}
              className="mt-6 h-12 w-full rounded-xl bg-sky-500 text-base font-semibold text-slate-950 hover:bg-sky-400"
              disabled={!studentName.trim()}
            >
              Start Module 1
            </Button>

            <div className="mt-8 rounded-2xl border border-amber-400/30 bg-amber-400/10 p-4 text-sm leading-6 text-amber-100">
              <p className="font-semibold text-amber-50">Google Sheets</p>
              <p className="mt-2">
                Results are submitted automatically after both modules are completed.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
