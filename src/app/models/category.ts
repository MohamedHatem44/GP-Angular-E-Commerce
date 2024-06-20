export interface ProductBelongToCategory {
  id: number;
  title: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
  imageUrl?: string;
  createdAt: Date;
  productsCount?: number;
  products?: ProductBelongToCategory[];
}
