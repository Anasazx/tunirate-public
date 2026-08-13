export interface SearchSuggestion {
  id: number;
  name: string;
  type: 'PRODUCT' | 'COMPANY';
  imageUrl: string | null;
  companyName: string | null;
}
