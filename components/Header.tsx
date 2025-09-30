
import React from 'react';

const BrainCircuitIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 3v1.5M4.5 8.25H3m18 0h-1.5M4.5 12H3m18 0h-1.5m-15 3.75H3m18 0h-1.5M8.25 19.5V21M12 3v1.5m0 15V21m3.75-18v1.5m0 15V21m-9-1.5h10.5a2.25 2.25 0 0 0 2.25-2.25V8.25a2.25 2.25 0 0 0-2.25-2.25H6.75A2.25 2.25 0 0 0 4.5 8.25v7.5A2.25 2.25 0 0 0 6.75 18Z" />
  </svg>
);


export const Header: React.FC = () => {
  return (
    <header className="text-center mb-8">
      <div className="flex items-center justify-center gap-4 mb-2">
        <BrainCircuitIcon className="w-12 h-12 text-sky-400" />
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-white">
          AI Text Analyzer
        </h1>
      </div>
      <p className="text-slate-400 max-w-2xl mx-auto">
        Determine if text is AI-generated or human-written. Get detailed evidence and actionable suggestions to make your writing more authentic.
      </p>
    </header>
  );
};
