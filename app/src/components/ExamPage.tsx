import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Timer } from './Timer';
import { 
  ChevronLeft, 
  ChevronRight, 
  Flag, 
  Send,
  AlertTriangle,
  BookOpen,
  Clock
} from 'lucide-react';
import type { Question } from '@/types/exam';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface ExamPageProps {
  module: number;
  questions: Question[];
  studentName: string;
  subject: 'english' | 'math';
  onComplete: (answers: Record<string, string>) => void;
  onTimeUp: (answers: Record<string, string>) => void;
}

const ENGLISH_TIME = 32 * 60; // 32 minutes in seconds for English
const MATH_TIME = 35 * 60; // 35 minutes in seconds for Math

export function ExamPage({ module, questions, studentName, subject, onComplete, onTimeUp }: ExamPageProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [flaggedQuestions, setFlaggedQuestions] = useState<Set<number>>(new Set());
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);
  const [showTimeUpDialog, setShowTimeUpDialog] = useState(false);
  const [timerActive, setTimerActive] = useState(true);
  
  const isEnglish = subject === 'english';
  const moduleTime = isEnglish ? ENGLISH_TIME : MATH_TIME;
  const subjectTitle = isEnglish ? 'English & Language Arts' : 'Mathematics';

  const currentQ = questions[currentQuestion];
  const totalQuestions = questions.length;
  const answeredCount = Object.keys(answers).length;
  const progress = ((currentQuestion + 1) / totalQuestions) * 100;

  const handleAnswer = (value: string) => {
    setAnswers((prev) => ({
      ...prev,
      [`${module}-${currentQ.id}`]: value,
    }));
  };

  const handleNext = () => {
    if (currentQuestion < totalQuestions - 1) {
      setCurrentQuestion((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1);
    }
  };

  const toggleFlag = () => {
    setFlaggedQuestions((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(currentQuestion)) {
        newSet.delete(currentQuestion);
      } else {
        newSet.add(currentQuestion);
      }
      return newSet;
    });
  };

  const handleTimeUp = useCallback(() => {
    setTimerActive(false);
    setShowTimeUpDialog(true);
    setTimeout(() => {
      onTimeUp(answers);
    }, 3000);
  }, [onTimeUp, answers]);

  const handleSubmit = () => {
    setShowSubmitDialog(false);
    setTimerActive(false);
    onComplete(answers);
  };

  const getOptionLetter = (index: number) => {
    return String.fromCharCode(65 + index);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <BookOpen className={`w-6 h-6 ${isEnglish ? 'text-emerald-600' : 'text-blue-600'}`} />
              <div>
                <h1 className="font-semibold text-gray-900">
                  SAT {subjectTitle} - Module {module}
                </h1>
                <p className="text-sm text-gray-500">Student: {studentName}</p>
              </div>
            </div>
            <Timer
              initialSeconds={moduleTime}
              onTimeUp={handleTimeUp}
              isActive={timerActive}
            />
          </div>
          
          <div className="mt-3">
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>Question {currentQuestion + 1} of {totalQuestions}</span>
              <span>{answeredCount} answered</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`${isEnglish ? 'bg-emerald-600' : 'bg-blue-600'} h-2 rounded-full transition-all duration-300`}
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6">
        <div className="grid md:grid-cols-[1fr,280px] gap-6">
          <div>
            <Card className="shadow-md">
              <CardContent className="p-6">
                <div className="mb-6">
                  <span className={`inline-block ${isEnglish ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'} text-sm font-medium px-3 py-1 rounded-full mb-4`}>
                    Question {currentQ.id}
                  </span>
                  
                  {/* Display passage if exists */}
                  {currentQ.passage && (
                    <div className={`mb-6 p-4 bg-gray-50 border-l-4 ${isEnglish ? 'border-emerald-500' : 'border-blue-500'} rounded-r-lg`}>
                      <p className="text-sm text-gray-500 mb-2 font-medium">Reading Passage:</p>
                      <p className="text-gray-800 leading-relaxed whitespace-pre-line">
                        {currentQ.passage}
                      </p>
                    </div>
                  )}
                  
                  {/* Display image if exists */}
                  {currentQ.image && (
                    <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-500 mb-2 font-medium">Figure:</p>
                      <img 
                        src={currentQ.image} 
                        alt="Question figure" 
                        className="max-w-full h-auto rounded-lg"
                      />
                    </div>
                  )}
                  
                  <p className="text-lg text-gray-900 leading-relaxed">
                    {currentQ.text}
                  </p>
                </div>

                <RadioGroup
                  value={answers[`${module}-${currentQ.id}`] || ''}
                  onValueChange={handleAnswer}
                  className="space-y-3"
                >
                  {currentQ.options.map((option, index) => {
                    const letter = getOptionLetter(index);
                    return (
                      <div
                        key={index}
                        className={`flex items-start space-x-3 p-4 rounded-lg border-2 transition-all cursor-pointer ${
                          answers[`${module}-${currentQ.id}`] === letter
                            ? isEnglish 
                              ? 'border-emerald-500 bg-emerald-50' 
                              : 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                        }`}
                        onClick={() => handleAnswer(letter)}
                      >
                        <RadioGroupItem
                          value={letter}
                          id={`option-${index}`}
                          className="mt-0.5"
                        />
                        <Label
                          htmlFor={`option-${index}`}
                          className="flex-1 cursor-pointer font-normal"
                        >
                          <span className={`font-semibold ${isEnglish ? 'text-emerald-600' : 'text-blue-600'} mr-2`}>
                            {letter}.
                          </span>
                          {option}
                        </Label>
                      </div>
                    );
                  })}
                </RadioGroup>
              </CardContent>
            </Card>

            <div className="flex justify-between mt-6">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentQuestion === 0}
                className="flex items-center gap-2"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </Button>
              
              <Button
                variant="outline"
                onClick={toggleFlag}
                className={`flex items-center gap-2 ${
                  flaggedQuestions.has(currentQuestion)
                    ? 'text-orange-600 border-orange-300 bg-orange-50'
                    : ''
                }`}
              >
                <Flag className="w-4 h-4" />
                {flaggedQuestions.has(currentQuestion) ? 'Flagged' : 'Flag'}
              </Button>

              {currentQuestion === totalQuestions - 1 ? (
                <Button
                  onClick={() => setShowSubmitDialog(true)}
                  className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
                >
                  <Send className="w-4 h-4" />
                  Submit
                </Button>
              ) : (
                <Button
                  onClick={handleNext}
                  className={`flex items-center gap-2 ${isEnglish ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-blue-600 hover:bg-blue-700'}`}
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>

          <div className="hidden md:block">
            <Card className="shadow-md sticky top-32">
              <CardContent className="p-4">
                <h3 className="font-semibold text-gray-900 mb-4">Question Navigator</h3>
                <div className="grid grid-cols-5 gap-2">
                  {questions.map((q, idx) => {
                    const isAnswered = answers[`${module}-${q.id}`];
                    const isFlagged = flaggedQuestions.has(idx);
                    const isCurrent = idx === currentQuestion;
                    
                    return (
                      <button
                        key={q.id}
                        onClick={() => setCurrentQuestion(idx)}
                        className={`
                          w-10 h-10 rounded-lg text-sm font-medium transition-all
                          ${isCurrent
                            ? isEnglish 
                              ? 'bg-emerald-600 text-white ring-2 ring-emerald-300'
                              : 'bg-blue-600 text-white ring-2 ring-blue-300'
                            : isAnswered
                            ? isEnglish
                              ? 'bg-green-100 text-green-700 border border-green-300'
                              : 'bg-blue-100 text-blue-700 border border-blue-300'
                            : isFlagged
                            ? 'bg-orange-100 text-orange-700 border border-orange-300'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }
                        `}
                      >
                        {q.id}
                      </button>
                    );
                  })}
                </div>
                
                <div className="mt-4 space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-green-100 border border-green-300 rounded" />
                    <span className="text-gray-600">Answered</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-orange-100 border border-orange-300 rounded" />
                    <span className="text-gray-600">Flagged</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-emerald-600 rounded" />
                    <span className="text-gray-600">Current</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-gray-100 border border-gray-300 rounded" />
                    <span className="text-gray-600">Unanswered</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Dialog open={showSubmitDialog} onOpenChange={setShowSubmitDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-orange-500" />
              Submit Module {module}?
            </DialogTitle>
            <DialogDescription>
              You have answered {answeredCount} out of {totalQuestions} questions.
              {answeredCount < totalQuestions && (
                <span className="block mt-2 text-orange-600">
                  Warning: You have {totalQuestions - answeredCount} unanswered questions.
                </span>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSubmitDialog(false)}>
              Continue Review
            </Button>
            <Button onClick={handleSubmit} className="bg-green-600 hover:bg-green-700">
              Submit Module
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showTimeUpDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <Clock className="w-5 h-5" />
              Time's Up!
            </DialogTitle>
            <DialogDescription>
              Your time for Module {module} has ended. Your answers will be submitted automatically.
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}
