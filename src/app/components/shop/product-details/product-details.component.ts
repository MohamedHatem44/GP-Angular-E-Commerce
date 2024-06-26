import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../../services/product.service';
import { ReviewService } from '../../../services/review.service';
import { CartService } from '../../../services/cart.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Cart } from '../../../models/cart';
import { Product } from '../../../models/product';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css'],
})
export class ProductDetailsComponent implements OnInit {
  product: Product;
  reviews: any[] = [];
  productId: number;
  selectedColorId: number;
  selectedSizeId: number;
  quantity: number = 1;
  addToCartLoading: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private reviewService: ReviewService,
    private _CartService: CartService,
    private _ToastrService: ToastrService
  ) {}

  ngOnInit(): void {
    this.productId = Number(this.route.snapshot.paramMap.get('id'));
    this.getProductDetails();
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
}
