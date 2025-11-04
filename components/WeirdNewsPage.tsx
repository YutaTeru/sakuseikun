
import React from 'react';
import { newsData } from '../data/newsData';
import { ArticleCard } from './ArticleCard';

export const WeirdNewsPage: React.FC = () => {
  return (
    <div className="w-full max-w-4xl mx-auto">
       <div className="text-center mb-8">
         <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-300 to-lime-300">
          A Little Weird News
         </h2>
         <p className="text-gray-400 mt-1">
          英語学習者のための、ちょっと変わったニュース
         </p>
       </div>
       <div className="space-y-8">
         {newsData.map(article => (
           <ArticleCard key={article.id} article={article} />
         ))}
       </div>
    </div>
  );
};
