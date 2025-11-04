
import React, { useState } from 'react';
import type { ResultData } from '../types';
import { StoryView } from './StoryView';
import { QuestionsView } from './QuestionsView';
import { FlashcardsView } from './FlashcardsView';
import { BookOpenIcon } from './icons/BookOpenIcon';
import { PencilIcon } from './icons/PencilIcon';
import { CardsIcon } from './icons/CardsIcon';
import { ClipboardIcon } from './icons/ClipboardIcon';

interface ResultDisplayProps {
  result: ResultData | null;
  isLoading: boolean;
  error: string | null;
  originalText: string;
}

const LoadingSkeleton = () => (
  <div className="space-y-6 animate-pulse-fast">
    <div className="h-4 bg-gray-700 rounded w-3/4"></div>
    <div className="space-y-3">
      <div className="h-3 bg-gray-700 rounded"></div>
      <div className="h-3 bg-gray-700 rounded w-5/6"></div>
    </div>
    <div className="h-4 bg-gray-700 rounded w-1/2"></div>
    <div className="space-y-3">
      <div className="h-3 bg-gray-700 rounded"></div>
      <div className="h-3 bg-gray-700 rounded w-4/6"></div>
    </div>
  </div>
);

export const ResultDisplay: React.FC<ResultDisplayProps> = ({ result, isLoading, error }) => {
  const [activeTab, setActiveTab] = useState<'story' | 'questions' | 'flashcards'>('story');
  const [copyStatus, setCopyStatus] = useState('コピー');

  const handleCopy = () => {
    if (result) {
      const storyText = result.story
        .map(paragraph => paragraph.map(sentence => sentence.english).join(' '))
        .join('\n\n');
      
      navigator.clipboard.writeText(storyText).then(() => {
        setCopyStatus('コピーしました！');
        setTimeout(() => {
          setCopyStatus('コピー');
        }, 2000);
      }, (err) => {
        console.error('Could not copy text: ', err);
        setCopyStatus('失敗');
        setTimeout(() => {
          setCopyStatus('コピー');
        }, 2000);
      });
    }
  };

  const renderContent = () => {
    if (isLoading) {
      return <LoadingSkeleton />;
    }
    if (error) {
      return (
        <div className="text-center text-red-400 bg-red-900/20 p-4 rounded-lg">
          <p className="font-semibold">エラー</p>
          <p>{error}</p>
        </div>
      );
    }
    if (!result) {
      return (
        <div className="text-center text-gray-500 py-10">
          <p>生成ボタンを押して、長文と問題を作成しましょう！</p>
        </div>
      );
    }
    return (
      <>
        <div className="mb-4 border-b border-gray-700 flex justify-between items-center">
          <nav className="-mb-px flex space-x-4" aria-label="Tabs">
            <button
              onClick={() => setActiveTab('story')}
              className={`${
                activeTab === 'story'
                  ? 'border-blue-400 text-blue-400'
                  : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-500'
              } flex items-center whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm transition-colors`}
            >
              <BookOpenIcon className="w-5 h-5 mr-2"/>
              生成された長文
            </button>
            <button
              onClick={() => setActiveTab('questions')}
              className={`${
                activeTab === 'questions'
                  ? 'border-blue-400 text-blue-400'
                  : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-500'
              } flex items-center whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm transition-colors`}
            >
              <PencilIcon className="w-5 h-5 mr-2" />
              生成された問題
            </button>
             <button
              onClick={() => setActiveTab('flashcards')}
              className={`${
                activeTab === 'flashcards'
                  ? 'border-blue-400 text-blue-400'
                  : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-500'
              } flex items-center whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm transition-colors`}
            >
              <CardsIcon className="w-5 h-5 mr-2" />
              フラッシュカード
            </button>
          </nav>
          {activeTab === 'story' && result && (
            <button
              onClick={handleCopy}
              className="flex items-center text-sm px-3 py-1.5 bg-gray-700 hover:bg-gray-600 rounded-md transition-colors text-gray-300"
            >
              <ClipboardIcon className="w-4 h-4 mr-2" />
              {copyStatus}
            </button>
          )}
        </div>
        <div>
          {activeTab === 'story' && <StoryView story={result.story} />}
          {activeTab === 'questions' && <QuestionsView questions={result.questions} />}
          {activeTab === 'flashcards' && <FlashcardsView story={result.story} />}
        </div>
      </>
    );
  };

  return (
    <div className="bg-gray-800/60 p-6 rounded-xl border border-gray-700/50 shadow-lg min-h-[500px]">
      {renderContent()}
    </div>
  );
};