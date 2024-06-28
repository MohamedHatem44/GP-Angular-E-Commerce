import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../../services/product.service';
import { ReviewService } from '../../../services/review.service';
import { CartService } from '../../../services/cart.service';
import { ToastrService } from 'ngx-toastr';
import { Cart } from '../../../models/cart';
import { ExtendedProduct, Product } from '../../../models/product';
import { Review } from '../../../models/review';
import { Category } from '../../../models/category';
import { WishListService } from '../../../services/wishList.service';
import { WishList } from '../../../models/wishList';
/*--------------------------------------------------------------------*/
@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css'],
})
/*--------------------------------------------------------------------*/
export class ProductDetailsComponent implements OnInit {
  product: Product;
  category: Category;
  extendedProduct: ExtendedProduct;
  reviews: Review[] = [];
  productId: number;
  selectedColorId: number;
  selectedSizeId: number;
  quantity: number = 1;
  addToCartLoading: boolean = false;
  reviewsLoading: boolean;
  productLoading: boolean = false;
  apiError: string | null = null;
  selectedTab: string = 'description';
  allProductsParCategory: Product[] = [];
  allProducts: ExtendedProduct[] = [];
  isLoading: boolean = false;
  productsInSlides: any[] = [];
  iterationIncrement: number = 0;
  error: string = '';

  // WishList
  wishList: any;
  wishListItems: any[] = [];
  wishListApiError: string | null = null;
  /*------------------------------------------------------------------*/
  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private _ReviewService: ReviewService,
    private _CartService: CartService,
    private _WishListService: WishListService,
    private _ToastrService: ToastrService
  ) {}
  /*-----------------------------------------------------------------*/
  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.productId = +params['id'];
      this.getProductDetails();
    });
    this.loadWishList();
    this.getProductDetails();
    this.loadProductReviews(this.productId);
    this.onResize(null);
  }
  /*-----------------------------------------------------------------*/
  // Load WishList
  private async loadWishList(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this._WishListService.getWishListByUserFromClaims().subscribe({
        next: (response: any) => {
          this.wishList = response;
          this.wishListItems = response.wishListItems;
          resolve();
        },
        error: (err) => {
          this.wishListApiError = 'Failed to load WishList, Please try again.';
          reject(err);
        },
      });
    });
  }
  /*------------------------------------------------------------------*/
  getProductDetails() {
    this.productService.getSpecificProductWithDetails(this.productId).subscribe(
      (data) => {
        this.product = data;
        this.getRelatedProducts(data.category.id);
      },
      (error) => {
        console.error('Error fetching product details', error);
      }
    );
  }

  /*------------------------------------------------------------------*/
  increaseQuantity(): void {
    const maxQuantity = 20;
    if (this.quantity >= maxQuantity) {
      this._ToastrService.error(`You can only add up to ${maxQuantity} items`);
      return;
    }
    this.quantity++;
  }
  /*------------------------------------------------------------------*/
  decreaseQuantity(): void {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }
  /*------------------------------------------------------------------*/
  addToCart() {
    this.addToCartLoading = true;
    if (!this.selectedColorId || !this.selectedSizeId) {
      this._ToastrService.error('You must Select Color and Size');
      this.addToCartLoading = false;
      return;
    }
    if (this.quantity > 20) {
      this._ToastrService.error(`You can only add up to 20 items`);
      this.addToCartLoading = false;
      return;
    }
    if (this.quantity === 0) {
      this._ToastrService.error('Quantity must be at least 1');
      this.addToCartLoading = false;
      return;
    }
    const itemToAdd: Cart = {
      productId: this.productId,
      colorId: this.selectedColorId,
      sizeId: this.selectedSizeId,
      quantity: this.quantity,
    };
    this._CartService.addToCart(itemToAdd).subscribe({
      next: (response: any) => {
        this._ToastrService.success('Item added to cart successfully');
        this.addToCartLoading = false;
      },
      error: (error) => {
        if (error.status === 400) {
          this._ToastrService.error(`This Product does not have enough quantity in stock, Only available ${this.product.quantity}`);
          return;
        } else {
          this._ToastrService.error('Failed to add item to cart');
        }
        this.addToCartLoading = false;
      },
    });
  }
  /*------------------------------------------------------------------*/
  // Get Reviews By Product Id
  private loadProductReviews(productId: number): void {
    this.reviewsLoading = true;
    this._ReviewService.getAllReviewsByProductId(productId).subscribe({
      next: (response: any) => {
        this.reviews = response;
        this.reviewsLoading = false;
      },
      error: (error) => {
        this._ToastrService.error('Error fetching Product Reviews by Id, Please try again.');
        this.reviewsLoading = false;
      },
    });
  }
  /*------------------------------------------------------------------*/
  selectTab(tab: string) {
    this.selectedTab = tab;
  }
  /*------------------------------------------------------------------*/
  // Start slider
  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    if (window.innerWidth < 801) {
      this.iterationIncrement = 1;
    } else if (window.innerWidth >= 801 && window.innerWidth < 1100) {
      this.iterationIncrement = 2;
    } else {
      this.iterationIncrement = 3;
    }
    this.processProductsForSlider();
  }

  async getRelatedProducts(categoryId: number): Promise<void> {
    console.log(categoryId);
    try {
      this.isLoading = true;
      this.productService.getAllProductsWithPaginationForUser(1, 20, '', categoryId).subscribe(
        (data) => {
          console.log(data);

          this.allProductsParCategory = Array.isArray(data.items) ? data.items : [data.items];
          this.processProductsForSlider();
          this.isLoading = false;
          console.log(this.allProductsParCategory);
        },
        (error) => {
          console.error('Error fetching product details', error);
        }
      );
    } catch (err: any) {
      console.error(err);
      this.isLoading = false;
      this.error = err.message;
    }
  }

  processProductsForSlider() {
    this.productsInSlides = [];
    for (let i = 0; i < this.allProductsParCategory.length; i += this.iterationIncrement) {
      const slice = this.allProductsParCategory.slice(i, i + this.iterationIncrement);
      console.log(slice);

      this.productsInSlides.push(slice);
    }
  }

  getImageUrl(imagePath: string): string {
    return `path_to_images/${imagePath}`;
  }
  // End slider
  /*------------------------------------------------------------------*/
  /*------------------------------------------------------------------*/
  // Add / Remove from WishList
  addToWishList(extendedProduct: ExtendedProduct) {
    extendedProduct.isWishListLoading = true;
    const itemIdToAdd: WishList = {
      productId: extendedProduct.id,
    };
    const isCurrentlyInWishList = extendedProduct.isInWishList;
    this._WishListService.AddAndRemoveFromWishList(itemIdToAdd).subscribe({
      next: (response: any) => {
        if (isCurrentlyInWishList) {
          this._ToastrService.success('Product removed from wish list successfully');
        } else {
          this._ToastrService.success('Product added to wish list successfully');
        }
        extendedProduct.isWishListLoading = false;
        this.updateProductWishListState(extendedProduct);
      },
      error: (error) => {
        if (error.status === 400) {
          this._ToastrService.error('This Product Not Found');
        } else {
          this._ToastrService.error('Failed to add/remove item to/from wish list');
        }
        extendedProduct.isWishListLoading = false;
      },
    });
  }
  /*-----------------------------------------------------------------*/
  private updateProductWishListState(extendedProduct: ExtendedProduct): void {
    this.extendedProduct.isInWishList = !this.extendedProduct.isInWishList;
  }
  /*-----------------------------------------------------------------*/
  private isProductInWishList(productId: number): boolean {
    return this.wishListItems.some((item) => item.productId === productId);
  }
  /*-----------------------------------------------------------------*/
}
