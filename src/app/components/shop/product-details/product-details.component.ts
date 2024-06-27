import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../../services/product.service';
import { ReviewService } from '../../../services/review.service';
import { CartService } from '../../../services/cart.service';
import { ToastrService } from 'ngx-toastr';
import { Cart } from '../../../models/cart';
import { Product } from '../../../models/product';
import { Review } from '../../../models/review';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css'],
})
export class ProductDetailsComponent implements OnInit {
  product: Product;
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
  allProducts: Product[] = [];
  isLoading: boolean = false;
  itemsPerPage: number = 9;
  productsInSlides: any[] = [];
  iterationIncrement: number = 0;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private _ReviewService: ReviewService,
    private _CartService: CartService,
    private _ToastrService: ToastrService
  ) {}

  ngOnInit(): void {
    this.productId = Number(this.route.snapshot.paramMap.get('id'));
    this.getProductDetails();
    this.loadProductReviews(this.productId);
  }

  getProductDetails() {
    this.productService.getSpecificProductWithDetails(this.productId).subscribe(
      (data) => {
        this.product = data;
        console.log(this.product);
        console.log(this.product.colors);
        console.log(this.product.sizes);
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

  /*------------------------------------------------------------------*/
}
