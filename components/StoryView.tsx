
import React from 'react';
import type { SentencePair } from '../types';
import { vocabularyList } from '../data/vocabulary';

// Create a set of vocabulary words for efficient lookup.
// Using a Set provides O(1) average time complexity for lookups.
const vocabSet = new Set(vocabularyList.map(item => item.word.toLowerCase()));

// This function will take a sentence and return an array of React nodes
// with target vocabulary words wrapped in a highlighting span.
const highlightText = (text: string) => {
  // This regex splits the text by word boundaries, but keeps the words
  // as separate elements in the resulting array. This preserves spaces and punctuation.
  // It handles words with apostrophes and hyphens.
  const parts = text.split(/(\b[a-zA-Z'-]+\b)/);
  
  return parts.map((part, index) => {
    // We check if the current part is a word and if its lowercase version exists in our vocabulary set.
    if (/\b[a-zA-Z'-]+\b/.test(part) && vocabSet.has(part.toLowerCase())) {
      return (
        <span key={index} className="bg-yellow-500/30 text-yellow-300 rounded">
          {part}
        </span>
      );
    }
    // If it's not a vocabulary word (or if it's punctuation/space), return it as is.
    return <React.Fragment key={index}>{part}</React.Fragment>;
  });
};


interface StoryViewProps {
  story: SentencePair[][];
}

export const StoryView: React.FC<StoryViewProps> = ({ story }) => {
  return (
    <div className="space-y-6">
      <div className="p-4 bg-gray-900/50 rounded-lg space-y-4">
        {story.map((paragraph, pIndex) => (
          <p key={pIndex} className="text-gray-100 font-serif tracking-wide leading-relaxed">
            {/* We join sentences for the main view and then highlight */}
            {highlightText(paragraph.map(sentence => sentence.english).join(' '))}
          </p>
        ))}
      </div>

      <details className="group">
        <summary className="cursor-pointer text-sm font-medium text-gray-400 hover:text-white transition-colors">
          全訳
        </summary>
        <div className="mt-4 pt-4 border-t border-gray-700/50 space-y-8">
          {story.map((paragraph, pIndex) => (
            <div key={pIndex} className="space-y-6">
              {paragraph.map((sentence, sIndex) => (
                <div key={`${pIndex}-${sIndex}`} className="p-4 bg-gray-900/50 rounded-lg border-l-4 border-teal-500">
                  <p className="text-gray-100 mb-2 font-serif tracking-wide leading-relaxed">
                    {/* Highlight each individual sentence here */}
                    {highlightText(sentence.english)}
                  </p>
                  <p className="text-sm text-gray-400">{sentence.japanese}</p>
                </div>
              ))}
            </div>
          ))}
        </div>
      </details>
    </div>
  );
};
