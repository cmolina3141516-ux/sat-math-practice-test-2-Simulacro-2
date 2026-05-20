import { useMemo, useState } from 'react';
import './App.css';
import { MathLandingPage } from '@/components/MathLandingPage';
import { MathExamPage } from '@/components/MathExamPage';
import { MathResultsPage } from '@/components/MathResultsPage';
import {
  mathModules,
  type MathModuleDefinition,
  type ModuleAnswers,
  calculateModuleScore,
  calculateSatMathEstimate,
} from '@/data/mathExam';
import { useGoogleSheets } from '@/hooks/useGoogleSheets';

type AppScreen = 'landing' | 'module1' | 'module2' | 'submitting' | 'results';

function App() {
  const [screen, setScreen] = useState<AppScreen>('landing');
  const [studentName, setStudentName] = useState('');
  const [module1Answers, setModule1Answers] = useState<ModuleAnswers>({});
  const [module2Answers, setModule2Answers] = useState<ModuleAnswers>({});
  const [saveStatus, setSaveStatus] = useState<{
    saved: boolean;
    skipped: boolean;
    error?: string;
  } | null>(null);

  const { submitMathResults, isSubmitting } = useGoogleSheets();

  const module1 = mathModules[0];
  const module2 = mathModules[1];

  const results = useMemo(() => {
    const module1Score = calculateModuleScore(module1, module1Answers);
    const module2Score = calculateModuleScore(module2, module2Answers);
    const totalCorrect = module1Score.correct + module2Score.correct;
    const totalQuestions = module1.questions.length + module2.questions.length;
    const percentage = Math.round((totalCorrect / totalQuestions) * 100);
    const satEstimate = calculateSatMathEstimate(totalCorrect, totalQuestions);

    return {
      module1Score,
      module2Score,
      totalCorrect,
      totalQuestions,
      percentage,
      satEstimate,
    };
  }, [module1, module1Answers, module2, module2Answers]);

  const handleStart = (name: string) => {
    setStudentName(name.trim());
    setModule1Answers({});
    setModule2Answers({});
    setSaveStatus(null);
    setScreen('module1');
  };

  const handleModuleComplete = async (
    moduleDef: MathModuleDefinition,
    answers: ModuleAnswers
  ) => {
    if (moduleDef.id === 1) {
      setModule1Answers(answers);
      setScreen('module2');
      return;
    }

    setModule2Answers(answers);
    setScreen('submitting');

    const nextResults = {
      module1Score: calculateModuleScore(module1, module1Answers),
      module2Score: calculateModuleScore(module2, answers),
    };
    const totalCorrect = nextResults.module1Score.correct + nextResults.module2Score.correct;
    const totalQuestions = module1.questions.length + module2.questions.length;
    const satEstimate = calculateSatMathEstimate(totalCorrect, totalQuestions);

    const status = await submitMathResults({
      studentName,
      module1Score: nextResults.module1Score.correct,
      module1Total: module1.questions.length,
      module2Score: nextResults.module2Score.correct,
      module2Total: module2.questions.length,
      totalCorrect,
      totalQuestions,
      satEstimate,
      module1Answers,
      module2Answers: answers,
    });

    setSaveStatus(status);
    setScreen('results');
  };

  const handleRestart = () => {
    setStudentName('');
    setModule1Answers({});
    setModule2Answers({});
    setSaveStatus(null);
    setScreen('landing');
  };

  if (screen === 'landing') {
    return <MathLandingPage onStart={handleStart} />;
  }

  if (screen === 'module1') {
    return (
      <MathExamPage
        key={module1.id}
        module={module1}
        studentName={studentName}
        onComplete={(answers) => handleModuleComplete(module1, answers)}
        onTimeUp={(answers) => handleModuleComplete(module1, answers)}
      />
    );
  }

  if (screen === 'module2') {
    return (
      <MathExamPage
        key={module2.id}
        module={module2}
        studentName={studentName}
        onComplete={(answers) => handleModuleComplete(module2, answers)}
        onTimeUp={(answers) => handleModuleComplete(module2, answers)}
      />
    );
  }

  if (screen === 'submitting') {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-50 flex items-center justify-center px-6">
        <div className="max-w-md text-center rounded-3xl border border-slate-800 bg-slate-900/80 p-10 shadow-2xl">
          <div className="mx-auto mb-5 h-14 w-14 rounded-full border-4 border-slate-700 border-t-sky-400 animate-spin" />
          <h2 className="text-2xl font-semibold">Submitting your results</h2>
          <p className="mt-3 text-sm text-slate-300">
            Please wait while we finish scoring and store the attempt.
          </p>
          {isSubmitting && <p className="mt-4 text-xs uppercase tracking-[0.2em] text-sky-300">Saving to sheet</p>}
        </div>
      </div>
    );
  }

  return (
    <MathResultsPage
      studentName={studentName}
      module1={module1}
      module2={module2}
      module1Answers={module1Answers}
      module2Answers={module2Answers}
      results={results}
      saveStatus={saveStatus}
      onRestart={handleRestart}
    />
  );
}

export default App;
