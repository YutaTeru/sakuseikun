
export interface SentencePair {
  english: string;
  japanese: string;
}

export interface GenericQuestion {
  id: number;
  question_text: string;
  options: string[];
  answer: string;
  explanation: string;
}

export interface ResultData {
  story: SentencePair[][];
  questions: GenericQuestion[];
}

export interface QuestionType {
  id: string;
}

export interface AnalysisResult {
  fullText: string;
  extractedText: string;
  questionTypes: string[];
  analysisDetail: string;
}

// Types for Weird News Page
export interface VocabularyItem {
  word: string;
  meaning: string;
}

export interface NewsParagraph {
  english: string;
  japanese: string;
}

export interface NewsArticle {
  id: number;
  title: string;
  title_jp: string;
  body: NewsParagraph[];
  vocabulary: VocabularyItem[];
}