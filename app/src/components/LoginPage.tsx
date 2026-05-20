import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { GraduationCap, BookOpen, Clock, CheckCircle } from 'lucide-react';

interface LoginPageProps {
  onStart: (studentName: string) => void;
}

export function LoginPage({ onStart }: LoginPageProps) {
  const [studentName, setStudentName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName.trim()) {
      setError('Please enter your name to continue.');
      return;
    }
    onStart(studentName.trim());
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-emerald-600 p-4 rounded-full">
              <GraduationCap className="w-12 h-12 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            SAT English Practice Test
          </h1>
          <p className="text-xl text-gray-600">
            Reading and Writing Section
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-emerald-600" />
                Test Structure
              </CardTitle>
              <CardDescription>Overview of the exam format</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm text-gray-600">
                <strong>Module 1:</strong> 27 questions | 32 minutes
              </p>
              <p className="text-sm text-gray-600">
                <strong>Module 2:</strong> 27 questions | 32 minutes
              </p>
              <p className="text-sm text-gray-600">
                <strong>Total:</strong> 54 questions | 64 minutes
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-emerald-600" />
                Instructions
              </CardTitle>
              <CardDescription>How to take the practice test</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm text-gray-600">
                • Read each passage and question carefully
              </p>
              <p className="text-sm text-gray-600">
                • Select the best answer for each question
              </p>
              <p className="text-sm text-gray-600">
                • You can navigate between questions
              </p>
              <p className="text-sm text-gray-600">
                • The timer will start when you begin
              </p>
            </CardContent>
          </Card>
        </div>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-center">Student Information</CardTitle>
            <CardDescription className="text-center">
              Enter your name to start the practice test
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Input
                  type="text"
                  placeholder="Your full name"
                  value={studentName}
                  onChange={(e) => {
                    setStudentName(e.target.value);
                    setError('');
                  }}
                  className="text-lg py-6"
                />
                {error && (
                  <p className="text-red-500 text-sm mt-2">{error}</p>
                )}
              </div>
              <Button
                type="submit"
                className="w-full py-6 text-lg bg-emerald-600 hover:bg-emerald-700"
              >
                <CheckCircle className="w-5 h-5 mr-2" />
                Start Practice Test
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="mt-8 text-center text-sm text-gray-500">
          <p>This practice test simulates the SAT Reading and Writing section.</p>
        </div>
      </div>
    </div>
  );
}
