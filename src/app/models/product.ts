import { Brand } from './brand';
import { Category } from './category';
import { Color } from './color';
import { Review } from './review';
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
  isInWishList?: boolean;
}
/*--------------------------------------------------------------------*/
export interface ExtendedProduct extends Product {
  isInWishList?: boolean;
  isWishListLoading?: boolean;
}
/*--------------------------------------------------------------------*/
