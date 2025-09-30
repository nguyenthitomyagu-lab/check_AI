
import React from 'react';
import type { AnalysisResultData, Conclusion, Evidence, HumanizeSuggestion, SuspiciousExcerpt } from '../types';

const getConclusionColors = (conclusion: Conclusion): string => {
  switch (conclusion) {
    case 'AI Written':
      return 'bg-red-500 border-red-400 text-white';
    case 'Human Written':
      return 'bg-green-500 border-green-400 text-white';
    case 'Uncertain':
      return 'bg-yellow-500 border-yellow-400 text-slate-900';
    default:
      return 'bg-slate-500 border-slate-400';
  }
};

const Section: React.FC<{ title: string; icon: React.ReactNode; children: React.ReactNode }> = ({ title, icon, children }) => (
    <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-4">
            <div className="flex-shrink-0 bg-slate-700 rounded-full p-2 text-sky-400">{icon}</div>
            <h2 className="text-xl font-bold text-white">{title}</h2>
        </div>
        <div>{children}</div>
    </div>
);

const EvidenceIcon: React.FC<{className?: string}> = ({className}) => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 0 0 6-6v-1.5m-6 7.5a6 6 0 0 1-6-6v-1.5m12 0v-1.5a6 6 0 0 0-6-6v-1.5a6 6 0 0 0-6 6v1.5m12 0v-1.5a6 6 0 0 0-6-6v-1.5a6 6 0 0 0-6 6v1.5" /></svg>);
const ExcerptIcon: React.FC<{className?: string}> = ({className}) => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" /></svg>);
const SuggestionIcon: React.FC<{className?: string}> = ({className}) => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 11.667 0l3.181-3.183m-4.991-2.691v4.99" /></svg>);

export const AnalysisResultDisplay: React.FC<{ result: AnalysisResultData }> = ({ result }) => {
    const conclusionColors = getConclusionColors(result.conclusion);
    const probabilityColor = result.aiProbability > 70 ? 'bg-red-500' : result.aiProbability > 40 ? 'bg-yellow-500' : 'bg-green-500';

    return (
        <div className="mt-8 space-y-8 animate-fade-in">
            {/* Summary Card */}
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 text-center">
                <p className="text-sm font-medium text-slate-400 mb-2">Overall Conclusion</p>
                <div className={`inline-block px-6 py-2 rounded-full text-lg font-bold border ${conclusionColors}`}>
                    {result.conclusion}
                </div>
                <div className="mt-4 max-w-md mx-auto">
                    <p className="text-sm text-slate-400 mb-1">AI-Written Probability: <span className="font-bold text-white">{result.aiProbability}%</span></p>
                    <div className="w-full bg-slate-700 rounded-full h-2.5">
                        <div className={`${probabilityColor} h-2.5 rounded-full`} style={{ width: `${result.aiProbability}%` }}></div>
                    </div>
                </div>
            </div>

            {/* Evidence */}
            <Section title="Evidence Breakdown" icon={<EvidenceIcon className="w-6 h-6"/>}>
                <ul className="space-y-4">
                    {result.evidence.map((item, index) => (
                        <li key={index} className="flex gap-4">
                            <div className="flex-shrink-0 w-2 h-full bg-sky-500/50 rounded-full mt-1"></div>
                            <div>
                                <h3 className="font-semibold text-sky-300">{item.signal}</h3>
                                <p className="text-slate-400">{item.explanation}</p>
                            </div>
                        </li>
                    ))}
                </ul>
            </Section>

            {/* Suspicious Excerpts */}
            <Section title="Suspicious Excerpts" icon={<ExcerptIcon className="w-6 h-6"/>}>
                <ul className="space-y-5">
                    {result.suspiciousExcerpts.map((item, index) => (
                        <li key={index}>
                            <blockquote className="border-l-4 border-yellow-500 pl-4 italic bg-yellow-900/10 py-2">
                                "{item.excerpt}"
                            </blockquote>
                            <p className="mt-2 text-slate-400 text-sm"><span className="font-semibold text-yellow-400">Reason:</span> {item.reason}</p>
                        </li>
                    ))}
                </ul>
            </Section>

            {/* Humanize Suggestions */}
            <Section title="Humanize Suggestions" icon={<SuggestionIcon className="w-6 h-6"/>}>
                <div className="space-y-6">
                    {result.humanizeSuggestions.map((item, index) => (
                        <div key={index} className="border-b border-slate-700 pb-6 last:border-b-0 last:pb-0">
                            <p className="font-semibold text-slate-300"><span className="text-red-400">Problem:</span> {item.problem}</p>
                            <p className="mt-1 font-semibold text-slate-300"><span className="text-green-400">Fix:</span> {item.fix}</p>
                            <div className="mt-3 bg-slate-900/70 p-4 rounded-lg border border-slate-600">
                                <p className="text-sm font-medium text-slate-400 mb-1">Rewritten Example:</p>
                                <p className="text-slate-300 font-mono text-sm">"{item.example}"</p>
                            </div>
                             <p className="mt-3 text-sm text-slate-400"><span className="font-semibold text-sky-400">Why it works:</span> {item.why}</p>
                        </div>
                    ))}
                </div>
            </Section>
            
            {/* Limitations */}
             <div className="text-center text-sm text-slate-500 bg-slate-800/30 p-4 rounded-lg">
                <span className="font-bold">Note on Confidence:</span> {result.limitations}
            </div>
        </div>
    );
};
