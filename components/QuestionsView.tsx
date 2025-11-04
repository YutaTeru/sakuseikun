
import React from 'react';
import type { GenericQuestion } from '../types';
import { QuestionCard } from './QuestionCard';

interface QuestionsViewProps {
  questions: GenericQuestion[];
}

export const QuestionsView: React.FC<QuestionsViewProps> = ({ questions }) => {
  if (!questions || questions.length === 0) {
    return (
      <div className="text-center text-gray-500">
        生成された問題はありません。
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {questions.map((q, index) => (
         <QuestionCard key={`${q.id}-${index}`} question={q} />
      ))}
    </div>
  );
};