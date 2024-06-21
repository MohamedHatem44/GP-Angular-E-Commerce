export interface Review {
  rate: number;
  description: string;
  createdAt?: string;
  userId?: string;
  productId: number;
}
