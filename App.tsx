
import React, { useState, useCallback } from 'react';
import { InputForm } from './components/InputForm';
import { ResultDisplay } from './components/ResultDisplay';
import { WeirdNewsPage } from './components/WeirdNewsPage';
import { geminiService } from './services/geminiService';
import type { ResultData, AnalysisResult } from './types';
// Fix: Corrected casing in imported constant name from DEFAULT_ORIGINAL_text to DEFAULT_ORIGINAL_TEXT.
import { QUESTION_TYPES, DEFAULT_ORIGINAL_TEXT, DEFAULT_THEME } from './constants';
import { NewspaperIcon } from './components/icons/NewspaperIcon';

// Fix: Moved NavButton outside of the App component.
// This is a React best practice to prevent re-creation on every render.
// To resolve the "children is missing" error, the component's props are
// now explicitly defined with an interface and typed with React.FC.
interface NavButtonProps {
  isActive: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

const NavButton: React.FC<NavButtonProps> = ({ isActive, onClick, children }) => (
  <button
    onClick={onClick}
    className={`flex items-center px-3 sm:px-4 py-2 text-sm font-medium rounded-md transition-colors ${
      isActive
        ? 'bg-blue-600 text-white'
        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
    }`}
  >
    {children}
  </button>
);

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve((reader.result as string).split(',')[1]);
    reader.onerror = error => reject(error);
  });
};

const App: React.FC = () => {
  const [page, setPage] = useState<'creator' | 'news'>('creator');

  // State for AI Creator
  const [originalText, setOriginalText] = useState<string>('');
  const [passageForGeneration, setPassageForGeneration] = useState<string>('');
  const [theme, setTheme] = useState<string>(DEFAULT_THEME);
  const [creativity, setCreativity] = useState<number>(50);
  const [themeStrength, setThemeStrength] = useState<number>(50);
  const [nicheLevel, setNicheLevel] = useState<number>(50);
  const [isHighAccuracyMode, setIsHighAccuracyMode] = useState<boolean>(false);

  const [result, setResult] = useState<ResultData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  // State for image/text analysis
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [analysisDetail, setAnalysisDetail] = useState<string>('');
  const [analyzedQuestionTypes, setAnalyzedQuestionTypes] = useState<Record<string, boolean> | null>(null);

  const handleAnalyze = useCallback(async () => {
    setIsAnalyzing(true);
    setAnalysisError(null);
    setAnalysisDetail('');
    setAnalyzedQuestionTypes(null);
    setResult(null); // Clear previous results

    try {
      let analysisResult: AnalysisResult | null = null;

      if (uploadedFile) {
        const base64Image = await fileToBase64(uploadedFile);
        analysisResult = await geminiService.analyzeImage(base64Image, uploadedFile.type);
      } else if (originalText.trim()) {
        analysisResult = await geminiService.analyzeText(originalText);
      } else {
        setAnalysisError('分析するテキストまたは画像を指定してください。');
        setIsAnalyzing(false);
        return;
      }
      
      if (analysisResult) {
        const detailText = analysisResult.analysisDetail || '分析結果を生成できませんでした。';
        
        if (analysisResult.fullText) {
          setOriginalText(analysisResult.fullText);
        } else {
          setAnalysisError('コンテンツからテキストを抽出できませんでした。手動で貼り付けてください。');
        }
        setPassageForGeneration(analysisResult.extractedText || '');
        
        const finalQuestionTypes = analysisResult.questionTypes || [];
        
        setAnalysisDetail(detailText);
  
        const newSelectedTypes = QUESTION_TYPES.reduce((acc, type) => {
          acc[type.id] = finalQuestionTypes.includes(type.id);
          return acc;
        }, {} as Record<string, boolean>);
        setAnalyzedQuestionTypes(newSelectedTypes);
      }
    } catch (e) {
      console.error(e);
      setAnalysisError('コンテンツの分析中にエラーが発生しました。');
    } finally {
      setIsAnalyzing(false);
      setUploadedFile(null); // Clear file after analysis to show the extracted text
    }
  }, [uploadedFile, originalText]);

  const handleGenerate = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    if (!analyzedQuestionTypes) {
      setError("問題を生成するには、まず「問題を分析する」ボタンを押して分析を実行してください。");
      setIsLoading(false);
      return;
    }

    const activeQuestionIds = Object.entries(analyzedQuestionTypes)
      .filter(([, isSelected]) => isSelected)
      .map(([id]) => id);

    try {
      const generatedData = await geminiService.generateContent(
        passageForGeneration,
        theme,
        creativity,
        themeStrength,
        nicheLevel,
        activeQuestionIds,
        isHighAccuracyMode,
        analysisDetail
      );
      setResult(generatedData);
    } catch (e) {
      console.error(e);
      setError('コンテンツの生成中にエラーが発生しました。しばらくしてからもう一度お試しください。');
    } finally {
      setIsLoading(false);
    }
  }, [passageForGeneration, theme, creativity, themeStrength, nicheLevel, isHighAccuracyMode, analysisDetail, analyzedQuestionTypes]);
  
  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 font-sans">
      <div className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700/50 sticky top-0 z-10">
        <header className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div>
            <h1 className="text-xl md:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-teal-300">
              AI英語学習アシスタント
            </h1>
          </div>
          <nav className="flex items-center space-x-1 sm:space-x-2 bg-gray-900/50 p-1 rounded-lg border border-gray-700">
            <NavButton isActive={page === 'creator'} onClick={() => setPage('creator')}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1.5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
              <span className="truncate">問題生成</span>
            </NavButton>
            <NavButton isActive={page === 'news'} onClick={() => setPage('news')}>
              <NewspaperIcon className="w-5 h-5 mr-1.5" />
              <span className="truncate">変なニュース</span>
            </NavButton>
          </nav>
        </header>
      </div>

      <main className="container mx-auto p-4 md:p-6">
        {page === 'creator' ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-8">
            <div className="lg:sticky lg:top-24 self-start">
              <InputForm
                originalText={originalText}
                setOriginalText={setOriginalText}
                passageForGeneration={passageForGeneration}
                setPassageForGeneration={setPassageForGeneration}
                theme={theme}
                setTheme={setTheme}
                creativity={creativity}
                setCreativity={setCreativity}
                themeStrength={themeStrength}
                setThemeStrength={setThemeStrength}
                nicheLevel={nicheLevel}
                setNicheLevel={setNicheLevel}
                isHighAccuracyMode={isHighAccuracyMode}
                setIsHighAccuracyMode={setIsHighAccuracyMode}
                onGenerate={handleGenerate}
                isLoading={isLoading}
                uploadedFile={uploadedFile}
                setUploadedFile={setUploadedFile}
                onAnalyze={handleAnalyze}
                isAnalyzing={isAnalyzing}
                analysisError={analysisError}
                analysisDetail={analysisDetail}
                setAnalysisDetail={setAnalysisDetail}
              />
            </div>
            <div className="mt-8 lg:mt-0">
              <ResultDisplay result={result} isLoading={isLoading} error={error} originalText={originalText} />
            </div>
          </div>
        ) : (
          <WeirdNewsPage />
        )}
      </main>
    </div>
  );
};

export default App;
