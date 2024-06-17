export interface ProductBelongToBrand {
  id: number;
  title: string;
}

export interface Brand {
  id: number;
  name: string;
  slug: string;
  description: string;
  imageUrl?: string;
  createdAt: Date;
  productsCount: number;
  products: ProductBelongToBrand[];
}
