
import React from 'react';
import type { NewsArticle } from '../types';

interface ArticleCardProps {
  article: NewsArticle;
}

export const ArticleCard: React.FC<ArticleCardProps> = ({ article }) => {
  return (
    <div className="bg-gray-800/60 p-6 rounded-xl border border-gray-700/50 shadow-lg">
      <h3 className="text-xl font-bold text-teal-400">{article.title}</h3>
      <p className="text-sm text-gray-400 mb-4">{article.title_jp}</p>

      <div className="space-y-4 mb-6">
        {article.body.map((paragraph, index) => (
          <p key={index} className="text-gray-200 leading-relaxed">
            {paragraph.english}
          </p>
        ))}
      </div>

      <div className="space-y-4">
        <details className="group">
          <summary className="cursor-pointer text-sm font-medium text-gray-400 hover:text-white transition-colors">
            日本語訳を見る
          </summary>
          <div className="mt-3 pt-3 border-t border-gray-700/50 text-sm space-y-3 text-gray-300">
            {article.body.map((paragraph, index) => (
              <p key={index}>{paragraph.japanese}</p>
            ))}
          </div>
        </details>
        
        <details className="group">
          <summary className="cursor-pointer text-sm font-medium text-gray-400 hover:text-white transition-colors">
            重要単語リスト
          </summary>
          <div className="mt-3 pt-3 border-t border-gray-700/50 text-sm">
            <ul className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-2">
              {article.vocabulary.map((vocab, index) => (
                <li key={index}>
                  <span className="font-semibold text-gray-200">{vocab.word}</span>: <span className="text-gray-400">{vocab.meaning}</span>
                </li>
              ))}
            </ul>
          </div>
        </details>
      </div>
    </div>
  );
};
