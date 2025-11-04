
import React from 'react';
import type { GenericQuestion } from '../types';

interface QuestionCardProps {
  question: GenericQuestion;
}

const renderOptions = (options: string[]) => {
  if (!options || options.length === 0) {
    return null;
  }
  
  const isPreformatted = options.every(opt => /^[A-Z]\./.test(opt.trim()));

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
      {options.map((option, i) => (
        <div key={i} className="bg-gray-900/60 p-2 rounded-md text-sm">
          {isPreformatted ? option : `${String.fromCharCode(65 + i)}. ${option}`}
        </div>
      ))}
    </div>
  );
}

export const QuestionCard: React.FC<QuestionCardProps> = ({ question }) => {
  return (
    <div className="bg-gray-900/50 p-5 rounded-lg border border-gray-700/70">
      <div className="mb-4 text-gray-200">
        <p className="mb-4" dangerouslySetInnerHTML={{ __html: question.question_text.replace(/___|\(\s*\)/g, '<span class="font-bold text-blue-400">( )</span>') }} />
        {renderOptions(question.options)}
      </div>
      
      <details className="group">
        <summary className="cursor-pointer text-sm font-medium text-gray-400 hover:text-white transition-colors">
          解答・解説を見る
        </summary>
        <div className="mt-4 pt-4 border-t border-gray-700/50 text-sm">
          <p className="font-bold text-green-400 mb-2">
            <span className="font-semibold text-gray-400">正解: </span>
            {question.answer}
          </p>
          <p className="text-gray-300">
            <span className="font-semibold text-gray-400">解説: </span>
            {question.explanation}
          </p>
        </div>
      </details>
    </div>
  );
};