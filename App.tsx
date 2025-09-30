
import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { TextInputForm } from './components/TextInputForm';
import { AnalysisResultDisplay } from './components/AnalysisResultDisplay';
import { Loader } from './components/Loader';
import { analyzeText } from './services/geminiService';
import type { AnalysisResultData, AnalysisMode } from './types';

const App: React.FC = () => {
  const [text, setText] = useState<string>('');
  const [language, setLanguage] = useState<string>('auto');
  const [mode, setMode] = useState<AnalysisMode>('full');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AnalysisResultData | null>(null);

  const handleAnalyze = useCallback(async () => {
    if (!text.trim()) {
      setError('Please enter some text to analyze.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const analysisResult = await analyzeText(text, { language, mode });
      setResult(analysisResult);
    } catch (err) {
      console.error('Analysis failed:', err);
      setError('An error occurred during analysis. The model may have returned an unexpected format. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [text, language, mode]);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 flex flex-col items-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-4xl mx-auto">
        <Header />
        <main>
          <TextInputForm
            text={text}
            setText={setText}
            language={language}
            setLanguage={setLanguage}
            mode={mode}
            setMode={setMode}
            onAnalyze={handleAnalyze}
            isLoading={isLoading}
          />
          {isLoading && <Loader />}
          {error && (
            <div className="mt-6 bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-lg text-center">
              <p>{error}</p>
            </div>
          )}
          {result && !isLoading && <AnalysisResultDisplay result={result} />}
        </main>
      </div>
       <footer className="w-full max-w-4xl mx-auto mt-12 text-center text-slate-500 text-sm">
          <p>This tool provides a probabilistic analysis and should not be used as definitive proof. Always use results as a guide for editing and review.</p>
        </footer>
    </div>
  );
};

export default App;
