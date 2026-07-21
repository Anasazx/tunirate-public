export interface ProductSuggestionResponse {
  id: number;
  name: string;
  companyName: string;
  description: string;
  status: string;
  createdAt: string;
  productId: number | null;
  productName: string | null;
}
