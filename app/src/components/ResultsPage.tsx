import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  CheckCircle, 
  XCircle, 
  Trophy, 
  Clock, 
  BookOpen,
  RotateCcw,
  Download
} from 'lucide-react';
import type { Question } from '@/types/exam';

interface ResultsPageProps {
  studentName: string;
  module1Answers: Record<string, string>;
  module2Answers: Record<string, string>;
  module1Questions: Question[];
  module2Questions: Question[];
  onRestart: () => void;
}

export function ResultsPage({
  studentName,
  module1Answers,
  module2Answers,
  module1Questions,
  module2Questions,
  onRestart,
}: ResultsPageProps) {
  const calculateScore = (answers: Record<string, string>, questions: Question[]) => {
    let correct = 0;
    questions.forEach((q) => {
      const moduleKey = `${q.module}-${q.id}`;
      if (answers[moduleKey] === q.correctAnswer) {
        correct++;
      }
    });
    return correct;
  };

  const module1Score = calculateScore(module1Answers, module1Questions);
  const module2Score = calculateScore(module2Answers, module2Questions);
  const totalCorrect = module1Score + module2Score;
  const totalQuestions = module1Questions.length + module2Questions.length;
  const percentage = Math.round((totalCorrect / totalQuestions) * 100);

  // SAT English Score calculation (200-800 scale)
  const satScore = Math.round(200 + (percentage / 100) * 600);
  const satRangeMin = Math.max(200, satScore - 50);
  const satRangeMax = Math.min(800, satScore + 50);

  const getScoreMessage = () => {
    if (percentage >= 80) return { message: 'Excellent!', color: 'text-green-600', bgColor: 'bg-green-100' };
    if (percentage >= 60) return { message: 'Good job!', color: 'text-blue-600', bgColor: 'bg-blue-100' };
    if (percentage >= 40) return { message: 'Keep practicing!', color: 'text-orange-600', bgColor: 'bg-orange-100' };
    return { message: 'More practice needed', color: 'text-red-600', bgColor: 'bg-red-100' };
  };

  const scoreInfo = getScoreMessage();

  const generateCSV = () => {
    const timestamp = new Date().toISOString();
    let csv = 'Module,Question,Student Answer,Correct Answer,Result\n';
    
    module1Questions.forEach((q) => {
      const key = `1-${q.id}`;
      const answer = module1Answers[key] || 'Not answered';
      const isCorrect = answer === q.correctAnswer;
      csv += `1,${q.id},${answer},${q.correctAnswer},${isCorrect ? 'Correct' : 'Incorrect'}\n`;
    });
    
    module2Questions.forEach((q) => {
      const key = `2-${q.id}`;
      const answer = module2Answers[key] || 'Not answered';
      const isCorrect = answer === q.correctAnswer;
      csv += `2,${q.id},${answer},${q.correctAnswer},${isCorrect ? 'Correct' : 'Incorrect'}\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SAT_English_Results_${studentName.replace(/\s+/g, '_')}_${timestamp.split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full ${scoreInfo.bgColor} mb-4`}>
            <Trophy className={`w-10 h-10 ${scoreInfo.color}`} />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Practice Test Complete!
          </h1>
          <p className="text-xl text-gray-600">
            Congratulations, {studentName}!
          </p>
        </div>

        <Card className="shadow-lg mb-6">
          <CardContent className="p-8 text-center">
            <div className={`text-6xl font-bold ${scoreInfo.color} mb-2`}>
              {percentage}%
            </div>
            <p className={`text-xl font-medium ${scoreInfo.color}`}>
              {scoreInfo.message}
            </p>
            <p className="text-gray-600 mt-2">
              {totalCorrect} out of {totalQuestions} questions correct
            </p>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-emerald-600" />
                Module 1
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900 mb-1">
                {module1Score}/{module1Questions.length}
              </div>
              <p className="text-gray-600">
                {Math.round((module1Score / module1Questions.length) * 100)}% correct
              </p>
              <div className="mt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Answered:</span>
                  <span className="font-medium">{Object.keys(module1Answers).length}/{module1Questions.length}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-emerald-600" />
                Module 2
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900 mb-1">
                {module2Score}/{module2Questions.length}
              </div>
              <p className="text-gray-600">
                {Math.round((module2Score / module2Questions.length) * 100)}% correct
              </p>
              <div className="mt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Answered:</span>
                  <span className="font-medium">{Object.keys(module2Answers).length}/{module2Questions.length}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="shadow-lg mb-6">
          <CardHeader>
            <CardTitle>Question Review</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Module 1</h3>
                <div className="grid grid-cols-9 gap-2">
                  {module1Questions.map((q) => {
                    const key = `1-${q.id}`;
                    const answer = module1Answers[key];
                    const isCorrect = answer === q.correctAnswer;
                    const isAnswered = !!answer;
                    
                    return (
                      <div
                        key={q.id}
                        className={`
                          flex items-center justify-center w-10 h-10 rounded-lg text-sm font-medium
                          ${isAnswered
                            ? isCorrect
                              ? 'bg-green-100 text-green-700 border border-green-300'
                              : 'bg-red-100 text-red-700 border border-red-300'
                            : 'bg-gray-100 text-gray-400 border border-gray-300'
                          }
                        `}
                        title={`Q${q.id}: ${isAnswered ? (isCorrect ? 'Correct' : 'Incorrect') : 'Not answered'}`}
                      >
                        {isAnswered ? (
                          isCorrect ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />
                        ) : (
                          q.id
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Module 2</h3>
                <div className="grid grid-cols-9 gap-2">
                  {module2Questions.map((q) => {
                    const key = `2-${q.id}`;
                    const answer = module2Answers[key];
                    const isCorrect = answer === q.correctAnswer;
                    const isAnswered = !!answer;
                    
                    return (
                      <div
                        key={q.id}
                        className={`
                          flex items-center justify-center w-10 h-10 rounded-lg text-sm font-medium
                          ${isAnswered
                            ? isCorrect
                              ? 'bg-green-100 text-green-700 border border-green-300'
                              : 'bg-red-100 text-red-700 border border-red-300'
                            : 'bg-gray-100 text-gray-400 border border-gray-300'
                          }
                        `}
                        title={`Q${q.id}: ${isAnswered ? (isCorrect ? 'Correct' : 'Incorrect') : 'Not answered'}`}
                      >
                        {isAnswered ? (
                          isCorrect ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />
                        ) : (
                          q.id
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="mt-4 flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-100 border border-green-300 rounded" />
                <span className="text-gray-600">Correct</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-red-100 border border-red-300 rounded" />
                <span className="text-gray-600">Incorrect</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-gray-100 border border-gray-300 rounded" />
                <span className="text-gray-600">Not answered</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={generateCSV}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Download Results (CSV)
          </Button>
          <Button
            onClick={onRestart}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700"
          >
            <RotateCcw className="w-4 h-4" />
            Take Test Again
          </Button>
        </div>

        <Card className="mt-6 shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-emerald-600" />
              SAT Score Estimate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Based on your performance, here's an estimate of how you might score on the actual SAT Reading and Writing section:
            </p>
            <div className="bg-emerald-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-emerald-700">
                Estimated Range: {satRangeMin} - {satRangeMax}
              </div>
              <p className="text-sm text-emerald-600 mt-1">
                *This is an unofficial estimate for practice purposes only.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
