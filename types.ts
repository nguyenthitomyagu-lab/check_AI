
export type AnalysisMode = 'light' | 'full';

export type Conclusion = 'AI Written' | 'Human Written' | 'Uncertain';

export interface AnalysisOptions {
  language: string;
  mode: AnalysisMode;
}

export interface Evidence {
  signal: string;
  explanation: string;
}

export interface SuspiciousExcerpt {
  excerpt: string;
  reason: string;
}

export interface HumanizeSuggestion {
  problem: string;
  fix: string;
  example: string;
  why: string;
}

export interface AnalysisResultData {
  conclusion: Conclusion;
  aiProbability: number;
  evidence: Evidence[];
  suspiciousExcerpts: SuspiciousExcerpt[];
  humanizeSuggestions: HumanizeSuggestion[];
  limitations: string;
}
