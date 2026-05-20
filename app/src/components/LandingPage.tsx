import { useState } from 'react';
import { BookOpen, Calculator, GraduationCap, Clock, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';

interface LandingPageProps {
  onSelectSubject: (subject: 'english' | 'math', studentName: string) => void;
}

export function LandingPage({ onSelectSubject }: LandingPageProps) {
  const [studentName, setStudentName] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<'english' | 'math' | null>(null);
  const [error, setError] = useState('');

  const handleStart = () => {
    if (!studentName.trim()) {
      setError('Please enter your name');
      return;
    }
    if (!selectedSubject) {
      setError('Please select a test');
      return;
    }
    setError('');
    onSelectSubject(selectedSubject, studentName.trim());
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white/10 rounded-full mb-6 backdrop-blur-sm">
            <GraduationCap className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
            SAT Practice Tests
          </h1>
          <p className="text-blue-200 text-lg">
            SAT practice test simulators
          </p>
        </div>

        {/* Name Input */}
        <div className="max-w-md mx-auto mb-8">
          <label className="block text-white text-sm font-medium mb-2">
            Student Name
          </label>
          <Input
            type="text"
            value={studentName}
            onChange={(e) => setStudentName(e.target.value)}
            placeholder="Enter your full name"
            className="w-full h-12 text-lg bg-white/10 border-white/20 text-white placeholder:text-white/50"
          />
        </div>

        {/* Subject Selection */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* English Card */}
          <Card
            className={`cursor-pointer transition-all duration-300 hover:scale-105 ${
              selectedSubject === 'english'
                ? 'ring-4 ring-emerald-400 bg-emerald-900/30'
                : 'bg-white/10 hover:bg-white/20'
            }`}
            onClick={() => setSelectedSubject('english')}
          >
            <CardContent className="p-8 text-center">
              <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${
                selectedSubject === 'english' ? 'bg-emerald-500' : 'bg-emerald-500/30'
              }`}>
                <BookOpen className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">
                English & Language Arts
              </h2>
              <p className="text-white/70 mb-4">
                Practice reading, grammar, and text comprehension
              </p>
              <div className="flex justify-center gap-4 text-sm">
                <span className="flex items-center gap-1 text-emerald-300">
                  <HelpCircle className="w-4 h-4" />
                  54 Questions
                </span>
                <span className="flex items-center gap-1 text-blue-300">
                  <Clock className="w-4 h-4" />
                  64 Minutes
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Math Card */}
          <Card
            className={`cursor-pointer transition-all duration-300 hover:scale-105 ${
              selectedSubject === 'math'
                ? 'ring-4 ring-blue-400 bg-blue-900/30'
                : 'bg-white/10 hover:bg-white/20'
            }`}
            onClick={() => setSelectedSubject('math')}
          >
            <CardContent className="p-8 text-center">
              <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${
                selectedSubject === 'math' ? 'bg-blue-500' : 'bg-blue-500/30'
              }`}>
                <Calculator className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">
                Mathematics
              </h2>
              <p className="text-white/70 mb-4">
                Practice algebra, problem solving, and data analysis
              </p>
              <div className="flex justify-center gap-4 text-sm">
                <span className="flex items-center gap-1 text-emerald-300">
                  <HelpCircle className="w-4 h-4" />
                  44 Questions
                </span>
                <span className="flex items-center gap-1 text-blue-300">
                  <Clock className="w-4 h-4" />
                  70 Minutes
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Error Message */}
        {error && (
          <p className="text-red-400 text-center mb-4">{error}</p>
        )}

        {/* Start Button */}
        <div className="text-center">
          <Button
            onClick={handleStart}
            className={`px-12 py-6 text-xl font-semibold rounded-full transition-all duration-300 ${
              selectedSubject === 'english'
                ? 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700'
                : selectedSubject === 'math'
                ? 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700'
                : 'bg-gradient-to-r from-slate-500 to-slate-600'
            } text-white shadow-lg hover:shadow-xl hover:scale-105`}
          >
            {selectedSubject === 'english'
              ? 'Start English Test'
              : selectedSubject === 'math'
              ? 'Start Math Test'
              : 'Select a Test'}
          </Button>
        </div>

        {/* Footer */}
        <p className="text-center text-white/50 text-sm mt-8">
          Results are saved automatically in Google Sheets
        </p>
      </div>
    </div>
  );
}
