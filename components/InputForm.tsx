
import React, { useState, useRef } from 'react';
import { SparklesIcon } from './icons/SparklesIcon';

interface InputFormProps {
  originalText: string;
  setOriginalText: (text: string) => void;
  passageForGeneration: string;
  setPassageForGeneration: (text: string) => void;
  theme: string;
  setTheme: (theme: string) => void;
  creativity: number;
  setCreativity: (level: number) => void;
  themeStrength: number;
  setThemeStrength: (level: number) => void;
  nicheLevel: number;
  setNicheLevel: (level: number) => void;
  isHighAccuracyMode: boolean;
  setIsHighAccuracyMode: (enabled: boolean) => void;
  onGenerate: () => void;
  isLoading: boolean;
  uploadedFile: File | null;
  setUploadedFile: (file: File | null) => void;
  onAnalyze: () => void;
  isAnalyzing: boolean;
  analysisError: string | null;
  analysisDetail: string;
  setAnalysisDetail: (detail: string) => void;
}

export const InputForm: React.FC<InputFormProps> = ({
  originalText,
  setOriginalText,
  passageForGeneration,
  setPassageForGeneration,
  theme,
  setTheme,
  creativity,
  setCreativity,
  themeStrength,
  setThemeStrength,
  nicheLevel,
  setNicheLevel,
  isHighAccuracyMode,
  setIsHighAccuracyMode,
  onGenerate,
  isLoading,
  uploadedFile,
  setUploadedFile,
  onAnalyze,
  isAnalyzing,
  analysisError,
  analysisDetail,
  setAnalysisDetail,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setOriginalText(''); // Clear text when file is selected
      setUploadedFile(file);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setOriginalText(''); // Clear text when file is dropped
      setUploadedFile(file);
    }
  };

  const handleDragEvents = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    handleDragEvents(e);
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    handleDragEvents(e);
    setIsDragging(false);
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setOriginalText(e.target.value);
    if (uploadedFile) {
      setUploadedFile(null); // Clear file when text is typed
    }
  }
  
  const handlePaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    const items = e.clipboardData.items;
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (item.type.startsWith('image/')) {
        const file = item.getAsFile();
        if (file) {
          setOriginalText(''); // Clear text
          setUploadedFile(file);
          // Prevent the default paste action (e.g., pasting file path)
          e.preventDefault(); 
          return; // Stop after handling the first image
        }
      }
    }
    // If no image is pasted, the default text paste will occur.
  };

  const filePreviewUrl = uploadedFile ? URL.createObjectURL(uploadedFile) : null;

  return (
    <div className="bg-gray-800/60 p-6 rounded-xl border border-gray-700/50 shadow-lg space-y-6">
      {/* --- Step 1: Input & Analyze --- */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          1. 試験問題を入力
        </label>
        <div
          onDrop={handleDrop}
          onDragOver={handleDragEvents}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          className={`relative bg-gray-900/50 border-2 border-dashed ${isDragging ? 'border-blue-500' : 'border-gray-600'} rounded-lg p-4 transition-colors min-h-[200px] flex flex-col justify-center items-center text-center`}
        >
          {uploadedFile && filePreviewUrl ? (
            <div>
              <img src={filePreviewUrl} alt="Preview" className="max-h-32 rounded-md mb-3 mx-auto" />
              <p className="text-sm text-gray-300 truncate max-w-xs">{uploadedFile.name}</p>
              <button
                onClick={() => setUploadedFile(null)}
                className="mt-1 text-xs text-red-400 hover:text-red-300"
              >
                画像を削除
              </button>
            </div>
          ) : (
            <div className="w-full h-full flex flex-col">
              <textarea
                id="original-text"
                rows={6}
                className="w-full bg-transparent border-none focus:ring-0 p-0 text-sm text-gray-200 resize-none flex-grow"
                placeholder="ここに試験問題のテキストを貼り付けるか、画像やスクリーンショットをペーストまたはドラッグ＆ドロップしてください..."
                value={originalText}
                onChange={handleTextChange}
                onPaste={handlePaste}
                disabled={isAnalyzing || isLoading}
              />
              <div className="text-gray-500 text-sm mt-2">
                または
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="ml-1.5 text-blue-400 font-semibold hover:text-blue-300 disabled:opacity-50"
                  disabled={isAnalyzing || isLoading}
                >
                  ファイルを選択
                </button>
              </div>
            </div>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
      </div>

      <button
        onClick={onAnalyze}
        disabled={(!uploadedFile && !originalText.trim()) || isAnalyzing || isLoading}
        className="w-full flex items-center justify-center bg-gray-600 hover:bg-gray-500 text-white font-bold py-2.5 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isAnalyzing ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            分析中...
          </>
        ) : (
          '問題を分析する'
        )}
      </button>

      {analysisError && <p className="text-sm text-red-400 text-center -mt-2">{analysisError}</p>}
      
      <hr className="border-gray-700/50" />
      
      {/* --- Step 2: Review Analysis & Customize --- */}
      <p className="text-sm text-gray-400 -mb-2">分析結果を元に、問題を作成します。</p>
      
      <div>
        <label htmlFor="analysis-detail-display" className="block text-sm font-medium text-gray-300 mb-2">
          2. 問題の分析
        </label>
        <textarea
          id="analysis-detail-display"
          rows={8}
          className="w-full bg-gray-900/50 border border-gray-600 rounded-lg p-3 text-sm text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          placeholder="問題が分析されると、ここに詳細な分析結果が表示されます..."
          value={analysisDetail}
          onChange={(e) => setAnalysisDetail(e.target.value)}
        />
      </div>

      <div>
        <label htmlFor="original-text-display" className="block text-sm font-medium text-gray-300 mb-2">
          3. 生成元の英文
        </label>
        <textarea
          id="original-text-display"
          rows={8}
          className="w-full bg-gray-900/50 border border-gray-600 rounded-lg p-3 text-sm text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          placeholder="分析後、ここに長文が抽出されます。編集も可能です。"
          value={passageForGeneration}
          onChange={(e) => setPassageForGeneration(e.target.value)}
        />
      </div>

      <div>
        <label htmlFor="theme" className="block text-sm font-medium text-gray-300 mb-2">
          4. テーマ
        </label>
        <input
          type="text"
          id="theme"
          className="w-full bg-gray-900/50 border border-gray-600 rounded-lg p-3 text-sm text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          placeholder="例：未来の東京での冒険"
          value={theme}
          onChange={(e) => setTheme(e.target.value)}
        />
      </div>
      
      <div>
        <label htmlFor="creativity" className="block text-sm font-medium text-gray-300 mb-2">
          5. 生成パラメータ
        </label>
        <div className='space-y-4 bg-gray-900/50 p-4 rounded-lg border border-gray-600'>
          <div>
            <label htmlFor="creativity" className="block text-xs font-medium text-gray-400 mb-1">
              創造性レベル: <span className="font-bold text-blue-400">{creativity}</span>
            </label>
            <input
              id="creativity"
              type="range"
              min="0"
              max="100"
              value={creativity}
              onChange={(e) => setCreativity(Number(e.target.value))}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>元の単語優先</span>
              <span>テーマ優先</span>
            </div>
          </div>
          <div>
            <label htmlFor="themeStrength" className="block text-xs font-medium text-gray-400 mb-1">
              テーマの反映度: <span className="font-bold text-blue-400">{themeStrength}</span>
            </label>
            <input
              id="themeStrength"
              type="range"
              min="0"
              max="100"
              value={themeStrength}
              onChange={(e) => setThemeStrength(Number(e.target.value))}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>控えめ</span>
              <span>全面的</span>
            </div>
          </div>
          <div>
            <label htmlFor="nicheLevel" className="block text-xs font-medium text-gray-400 mb-1">
              専門性/マニア度: <span className="font-bold text-blue-400">{nicheLevel}</span>
            </label>
            <input
              id="nicheLevel"
              type="range"
              min="0"
              max="100"
              value={nicheLevel}
              onChange={(e) => setNicheLevel(Number(e.target.value))}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>一般的</span>
              <span>専門的</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex items-center justify-between bg-gray-900/50 p-3 rounded-lg border border-gray-600">
        <div>
          <label htmlFor="high-accuracy-mode" className="font-medium text-gray-200">
            高精度モード (よく考える)
          </label>
          <p className="text-xs text-gray-400 mt-1">
            AIがより深く思考し、高品質な問題を生成します。(時間がかかる場合があります)
          </p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            id="high-accuracy-mode"
            className="sr-only peer"
            checked={isHighAccuracyMode}
            onChange={(e) => setIsHighAccuracyMode(e.target.checked)}
          />
          <div className="w-11 h-6 bg-gray-600 rounded-full peer peer-focus:ring-2 peer-focus:ring-blue-500/50 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
        </label>
      </div>

      <button
        onClick={onGenerate}
        disabled={isLoading || isAnalyzing}
        className="w-full flex items-center justify-center bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-700 hover:to-teal-600 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 disabled:transform-none"
      >
        {isLoading ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            生成中...
          </>
        ) : (
          <>
            <SparklesIcon className="w-5 h-5 mr-2" />
            魔法をかける (生成)
          </>
        )}
      </button>
    </div>
  );
};
