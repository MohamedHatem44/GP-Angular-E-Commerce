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
import { switchMap } from 'rxjs/operators'; // Import switchMap operator
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css'],
})
export class ProductDetailsComponent implements OnInit {
  product: Product;
  category: Category;
  extendedProduct: ExtendedProduct;
  reviews: Review[] = [];
  myReviews: Review[] = [];
  productId: number;
  selectedColorId: number;
  selectedSizeId: number;
  quantity: number = 1;
  addToCartLoading: boolean = false;
  reviewsLoading: boolean;
  myReviewsLoading: boolean;
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

  //review form
  reviewForm: FormGroup;
  userInfo: any;
  userId: string = '';
  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private _ReviewService: ReviewService,
    private _CartService: CartService,
    private _WishListService: WishListService,
    private _ToastrService: ToastrService,
    private fb: FormBuilder,
    private _userService: UserService
  ) {}

  ngOnInit(): void {
    this.route.params
      .pipe(
        switchMap((params) => {
          this.productId = +params['id'];
          this.productLoading = true;
          return this.productService.getSpecificProductWithDetails(this.productId);
        })
      )
      .subscribe(
        (product) => {
          this.product = product;
          this.productLoading = false;
          this.loadProductReviews(this.productId);
          this.getRelatedProducts(product.category.id);
        },
        (error) => {
          this.productLoading = false;
          console.error('Error fetching product details', error);
        }
      );

    this.reviewForm = this.fb.group({
      rate: ['', [Validators.required, Validators.min(1), Validators.max(5)]],
      title: ['', Validators.required],
      description: ['', [Validators.required, Validators.minLength(10)]],
      email: ['', [Validators.required, Validators.email]],
    });
    this.loadWishList();
    this.onResize(null);
    const token = localStorage.getItem('token');
    if (token) {
      this.userInfo = this._userService.getUserInfoFromToken(token);
      this.userId = this.userInfo['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'];
      this.loadProductReviewsForUser();
    }
  }

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

  private loadProductReviews(productId: number): void {
    this.reviewsLoading = true;
    this._ReviewService.getAllReviewsByProductId(productId).subscribe({
      next: (response: any) => {
        this.reviews = response;
        this.reviewsLoading = false;
        console.log(response);
      },
      error: (error) => {
        this._ToastrService.error('Error fetching Product Reviews by Id, Please try again.');
        this.reviewsLoading = false;
      },
    });
  }
  private loadProductReviewsForUser(): void {
    this.myReviewsLoading = true;
    this._ReviewService.getReviewByUserIdProductId().subscribe({
      next: (response: any) => {
        this.myReviews = response;
        this.myReviewsLoading = false;
        console.log(response);
      },
      error: (error) => {
        this._ToastrService.error('Error fetching Product Reviews by Id, Please try again.');
        this.myReviewsLoading = false;
      },
    });
  }

  increaseQuantity(): void {
    const maxQuantity = 20;
    if (this.quantity >= maxQuantity) {
      this._ToastrService.error(`You can only add up to ${maxQuantity} items`);
      return;
    }
    this.quantity++;
  }

  decreaseQuantity(): void {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

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

  selectTab(tab: string) {
    this.selectedTab = tab;
  }

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
    try {
      this.isLoading = true;
      this.productService.getAllProductsWithPaginationForUser(1, 20, '', categoryId).subscribe(
        (data) => {
          this.allProductsParCategory = Array.isArray(data.items) ? data.items : [data.items];
          this.processProductsForSlider();
          this.isLoading = false;
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
      this.productsInSlides.push(slice);
    }
  }

  getImageUrl(imagePath: string): string {
    return `path_to_images/${imagePath}`;
  }

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

  private updateProductWishListState(extendedProduct: ExtendedProduct): void {
    extendedProduct.isInWishList = !extendedProduct.isInWishList;
  }

  private isProductInWishList(productId: number): boolean {
    return this.wishListItems.some((item) => item.productId === productId);
  }

  // review form
  onSubmit() {
    console.log(this.productId);
    console.log(this.userId);

    if (this.reviewForm.valid) {
      const review: Review = {
        ...this.reviewForm.value,
        productId: this.productId,
        userId: this.userId,
      };
      console.log(review);
      console.log(review.userId);
      this._ReviewService.createReview(review);
      this._ToastrService.success('Review Added successfully');
      this.reviewForm = this.fb.group({
        rate: '',
        title: '',
        description: '',
        email: '',
      });
      this.loadProductReviews(this.productId);
    }
  }
}
