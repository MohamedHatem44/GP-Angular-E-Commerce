import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../../services/product.service';
import { ReviewService } from '../../../services/review.service';
import { CartService } from '../../../services/cart.service';
import { ToastrService } from 'ngx-toastr';
import { Cart } from '../../../models/cart';
import { Product } from '../../../models/product';
import { Review } from '../../../models/review';
import { Category } from '../../../models/category';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css'],
})
export class ProductDetailsComponent implements OnInit {
  product: Product;
  category: Category;
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
  isLoading: boolean = false;
  productsInSlides: any[] = [];
  iterationIncrement: number = 0;
  error: string = '';

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private _ReviewService: ReviewService,
    private _CartService: CartService,
    private _ToastrService: ToastrService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.productId = +params['id'];
      this.getProductDetails();
    });
    this.getProductDetails();
    this.loadProductReviews(this.productId);
    this.onResize(null);
  }

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
  // slider
  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.iterationIncrement = window.innerWidth < 500 ? 1 : 3;
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
  /*------------------------------------------------------------------*/
}
