import { Brand } from './brand';
import { Category } from './category';
import { Color } from './color';
import { Size } from './size';
/*--------------------------------------------------------------------*/
export interface Product {
  id?: number;
  title: string;
  slug?: string;
  description: string;
  imageUrl: string;
  quantity: number;
  sold?: number;
  price: number;
  priceAfterDiscount: number;
  ratingsAverage?: number;
  ratingsQuantity?: number;
  createdAt?: string;
  colors?: Color[];
  sizes?: Size[];
  categoryId: number;
  category?: Category;
  brandId: number;
  brand?: Brand;
  reviews?: Review[];
}
/*--------------------------------------------------------------------*/
export interface Review {
  rate: number;
  description: string;
  createdAt: string;
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
}
/*--------------------------------------------------------------------*/
