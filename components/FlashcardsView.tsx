
import React, { useState, useEffect, useMemo } from 'react';
import type { SentencePair } from '../types';

interface FlashcardsViewProps {
  story: SentencePair[][];
}

export const FlashcardsView: React.FC<FlashcardsViewProps> = ({ story }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const flatStory = useMemo(() => story.flat(), [story]);

  useEffect(() => {
    // Reset to the first card and unflipped state when the story changes
    setCurrentIndex(0);
    setIsFlipped(false);
  }, [flatStory]);

  if (!flatStory || flatStory.length === 0) {
    return (
      <div className="text-center text-gray-500">
        フラッシュカードを生成できませんでした。
      </div>
    );
  }
  
  const goToNext = () => {
    if (currentIndex < flatStory.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsFlipped(false);
    }
  };

  const goToPrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setIsFlipped(false);
    }
  };

  const currentSentence = flatStory[currentIndex];

  return (
    <div className="flex flex-col items-center">
      <div className="w-full max-w-lg h-64 [perspective:1000px] mb-4">
        <div
          className={`relative w-full h-full rounded-xl shadow-lg transition-transform duration-500 [transform-style:preserve-3d] ${isFlipped ? '[transform:rotateY(180deg)]' : ''}`}
          onClick={() => setIsFlipped(!isFlipped)}
        >
          {/* Front */}
          <div className="absolute w-full h-full bg-gray-900/70 border border-gray-700 rounded-xl p-6 flex items-center justify-center [backface-visibility:hidden]">
            <p className="text-center text-xl font-serif text-gray-100">{currentSentence.english}</p>
          </div>
          {/* Back */}
          <div className="absolute w-full h-full bg-teal-800/50 border border-teal-700 rounded-xl p-6 flex items-center justify-center [backface-visibility:hidden] [transform:rotateY(180deg)]">
            <p className="text-center text-lg text-white">{currentSentence.japanese}</p>
          </div>
        </div>
      </div>
      
      <p className="text-sm text-gray-400 mb-4">
        カードをクリックして翻訳を表示
      </p>

      <div className="flex items-center justify-center w-full max-w-lg">
        <button
          onClick={goToPrevious}
          disabled={currentIndex === 0}
          className="px-4 py-2 bg-gray-700 rounded-md text-white disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </button>
        <p className="mx-4 text-gray-300 font-mono text-lg">
          {currentIndex + 1} / {flatStory.length}
        </p>
        <button
          onClick={goToNext}
          disabled={currentIndex === flatStory.length - 1}
          className="px-4 py-2 bg-gray-700 rounded-md text-white disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  );
};