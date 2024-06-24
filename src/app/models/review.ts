export interface Review {
  rate: number;
  description: string;
  createdAt?: string;
  userId?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  productId: number;
}
