import { useState, useCallback } from 'react';
import type { ModuleAnswers } from '@/data/mathExam';

const GOOGLE_SHEETS_WEB_APP_URL = (import.meta.env.VITE_GOOGLE_SHEETS_WEB_APP_URL ?? '').trim();
const GOOGLE_SHEETS_EDIT_URL =
  'https://docs.google.com/spreadsheets/d/1YWPa4oyxabUj5qO14baa4QrhgC8GmrP7Sp0uUIeELek/edit?usp=sharing';

interface SubmitMathResultsPayload {
  studentName: string;
  module1Score: number;
  module1Total: number;
  module2Score: number;
  module2Total: number;
  totalCorrect: number;
  totalQuestions: number;
  satEstimate: {
    score: number;
    min: number;
    max: number;
  };
  module1Answers: ModuleAnswers;
  module2Answers: ModuleAnswers;
}

export function useGoogleSheets() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitMathResults = useCallback(async (payload: SubmitMathResultsPayload) => {
    if (!GOOGLE_SHEETS_WEB_APP_URL) {
      return {
        saved: false,
        skipped: true,
      };
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('exam', 'math');
      formData.append('studentName', payload.studentName);
      formData.append('module1Score', `${payload.module1Score}/${payload.module1Total}`);
      formData.append('module2Score', `${payload.module2Score}/${payload.module2Total}`);
      formData.append('totalScore', `${payload.totalCorrect}/${payload.totalQuestions}`);
      formData.append('satEstimate', String(payload.satEstimate.score));
      formData.append('satEstimateRange', `${payload.satEstimate.min}-${payload.satEstimate.max}`);
      formData.append('spreadsheetUrl', GOOGLE_SHEETS_EDIT_URL);
      formData.append('module1AnswersJson', JSON.stringify(payload.module1Answers));
      formData.append('module2AnswersJson', JSON.stringify(payload.module2Answers));

      Object.entries(payload.module1Answers).forEach(([questionId, answer]) => {
        formData.append(`M1_Q${questionId}`, answer);
      });

      Object.entries(payload.module2Answers).forEach(([questionId, answer]) => {
        formData.append(`M2_Q${questionId}`, answer);
      });

      if (GOOGLE_SHEETS_WEB_APP_URL.includes('script.google.com')) {
        await fetch(GOOGLE_SHEETS_WEB_APP_URL, {
          method: 'POST',
          mode: 'no-cors',
          body: formData,
        });

        return {
          saved: true,
          skipped: false,
        };
      }

      const response = await fetch(GOOGLE_SHEETS_WEB_APP_URL, {
        method: 'POST',
        body: formData,
      });

      const text = await response.text();

      if (!response.ok) {
        return {
          saved: false,
          skipped: false,
          error: `The Apps Script endpoint returned HTTP ${response.status}.`,
        };
      }

      try {
        const parsed = JSON.parse(text) as { result?: string; message?: string };
        if (parsed.result === 'success') {
          return {
            saved: true,
            skipped: false,
          };
        }

        return {
          saved: false,
          skipped: false,
          error: parsed.message || 'The Apps Script response did not confirm a successful save.',
        };
      } catch {
        return {
          saved: true,
          skipped: false,
        };
      }
    } catch (error) {
      return {
        saved: false,
        skipped: false,
        error: error instanceof Error ? error.message : 'Unknown error while submitting to Google Sheets.',
      };
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  return {
    submitMathResults,
    isSubmitting,
  };
}
