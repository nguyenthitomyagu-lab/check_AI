
import React from 'react';
import type { AnalysisMode } from '../types';

interface TextInputFormProps {
  text: string;
  setText: (text: string) => void;
  language: string;
  setLanguage: (lang: string) => void;
  mode: AnalysisMode;
  setMode: (mode: AnalysisMode) => void;
  onAnalyze: () => void;
  isLoading: boolean;
}

const AnalyzeIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
    </svg>
);


export const TextInputForm: React.FC<TextInputFormProps> = ({
  text,
  setText,
  language,
  setLanguage,
  mode,
  setMode,
  onAnalyze,
  isLoading,
}) => {
  return (
    <div className="bg-slate-800/50 p-6 rounded-xl shadow-lg border border-slate-700">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Paste your text here for analysis..."
        className="w-full h-64 p-4 bg-slate-900 border border-slate-600 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors duration-200 resize-y"
        disabled={isLoading}
      />
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
        <div className="col-span-1">
          <label htmlFor="language" className="block text-sm font-medium text-slate-400 mb-1">Language</label>
          <select
            id="language"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="w-full bg-slate-700 border border-slate-600 rounded-md px-3 py-2 focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
            disabled={isLoading}
          >
            <option value="auto">Auto-detect</option>
            <option value="en">English</option>
            <option value="vi">Vietnamese</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div className="col-span-1">
           <label className="block text-sm font-medium text-slate-400 mb-1">Analysis Mode</label>
           <div className="flex bg-slate-700 rounded-md p-1 border border-slate-600">
               <button onClick={() => setMode('light')} disabled={isLoading} className={`w-1/2 rounded py-1 text-sm font-semibold transition-colors ${mode === 'light' ? 'bg-sky-600 text-white' : 'hover:bg-slate-600'}`}>
                Light
               </button>
               <button onClick={() => setMode('full')} disabled={isLoading} className={`w-1/2 rounded py-1 text-sm font-semibold transition-colors ${mode === 'full' ? 'bg-sky-600 text-white' : 'hover:bg-slate-600'}`}>
                Full
               </button>
           </div>
        </div>
        <div className="col-span-1 sm:mt-6">
          <button
            onClick={onAnalyze}
            disabled={isLoading || !text.trim()}
            className="w-full flex items-center justify-center gap-2 bg-sky-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-sky-500 transition-colors duration-200 disabled:bg-slate-600 disabled:cursor-not-allowed disabled:text-slate-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-sky-500"
          >
            <AnalyzeIcon className="w-5 h-5"/>
            {isLoading ? 'Analyzing...' : 'Analyze Text'}
          </button>
        </div>
      </div>
    </div>
  );
};
