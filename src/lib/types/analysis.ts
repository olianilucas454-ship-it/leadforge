export interface NicheMatch {
  score: number;
  category: string;
  confidence: number;
  searchTerm: string;
  matchedCategory: string;
}

export interface WebsiteOpportunityResult {
  score: number;
  classification: 'hot' | 'warm' | 'cold';
  reasons: string[];
  suggestion: string;
}
