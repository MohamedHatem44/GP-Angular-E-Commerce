import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../../services/product.service';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Product } from '../../../models/product';
import { ReviewService } from '../../../services/review.service';
import { Review } from '../../../models/review';
/*--------------------------------------------------------------------*/
@Component({
  selector: 'app-admin-product-details',
  templateUrl: './admin-product-details.component.html',
  styleUrl: './admin-product-details.component.css',
})
/*--------------------------------------------------------------------*/
export class AdminProductDetailsComponent implements OnInit {
  // Component properties
  productLoading: boolean = false;
  reviewsLoading: boolean = false;
  product: Product;
  reviews: Review[];
  apiError: string | null = null;
  selectedTab: string = 'description';
  /*------------------------------------------------------------------*/
  // Ctor
  constructor(
    private _ProductService: ProductService,
    private _ReviewService: ReviewService,
    private _Route: ActivatedRoute,
    private _ToastrService: ToastrService
  ) {}
  /*------------------------------------------------------------------*/
  ngOnInit(): void {
    const productId = +this._Route.snapshot.paramMap.get('id');
    this.loadProductDetails(productId);
    this.loadProductReviews(productId);
  }

  /*------------------------------------------------------------------*/
  // Get a Specific Product By Id
  private loadProductDetails(productId: number): void {
    this.productLoading = true;
    this.apiError = null;
    this._ProductService.getSpecificProductWithDetails(productId).subscribe({
      next: (response: Product) => {
        this.product = response;
        this.productLoading = false;
        this.apiError = null;
      },
      error: (error) => {
        this._ToastrService.error('Error fetching Product by Id, Please try again');
        this.apiError = 'An Error Occurred While loading Product by Id, Please try again';
        this.productLoading = false;
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
}
