import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../../services/product.service';
import { CategoryService } from '../../../services/category.service';
import { Category } from '../../../models/category';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Product } from '../../../models/product';
import { PagedResponse } from '../../../models/pagedResponse';
import { ReviewService } from '../../../services/review.service';
import { Review } from '../../../models/review';
/*--------------------------------------------------------------------*/
@Component({
  selector: 'app-admin-product-reviews',
  templateUrl: './admin-product-reviews.component.html',
  styleUrl: './admin-product-reviews.component.css',
})
/*--------------------------------------------------------------------*/
export class AdminProductReviewsComponent implements OnInit {
  // Component properties
  productsLoading: boolean = false;
  categoriesLoading: boolean = false;
  reviewsLoading: boolean = false;
  products: Product[] = [];
  categories: Category[] = [];
  reviews: Review[] = [];
  currentPage: number = 1;
  pageSize: number = 50;
  apiError: string | null = null;
  searchInput: string = '';
  noProducts: boolean = false;
  noReviews: boolean = false;
  selectedCategory: number | null = null;
  selectedProduct: number | null = null;
  selectedBrand: number | null = null;
  /*-----------------------------------------------------------------*/
  // Ctor
  constructor(
    private _ProductService: ProductService,
    private _CategoryService: CategoryService,
    private _ReviewService: ReviewService,
    private _ModalService: NgbModal,
    private _ToastrService: ToastrService
  ) {}
  /*-----------------------------------------------------------------*/
  // Ng OnInit
  ngOnInit(): void {
    this.selectedCategory = null;
    this.selectedProduct = null;
    this.loadCategories();
  }
  /*-----------------------------------------------------------------*/
  // load Categories
  loadCategories(): void {
    this.apiError = null;
    this.categoriesLoading = true;
    this._CategoryService.getAllCategories().subscribe({
      next: (response: any) => {
        this.categories = response.categories;
        if (this.categories.length > 0) {
          this.selectedCategory = this.categories[0].id;

          this.fetchProducts(this.currentPage, this.searchInput, this.selectedCategory, this.selectedBrand);
        }
        this.categoriesLoading = false;
        this.apiError = null;
      },
      error: (err) => {
        this.apiError = 'An Error occured while Loading Product Reviews';
        // this._ToastrService.error('Failed to load categories, please try again.');
        this.categoriesLoading = false;
      },
    });
  }
  /*-----------------------------------------------------------------*/
  // Fetch Products
  async fetchProducts(page: number, searchParam?: string, categoryId?: number, brandId?: number): Promise<void> {
    this.productsLoading = true;
    this.apiError = null;
    (await this._ProductService.getAllProductsWithPaginationForAdmin(page, this.pageSize, searchParam, categoryId, brandId)).subscribe({
      next: (response: PagedResponse<Product>) => {
        this.products = response.items;
        if (this.products.length > 0) {
          this.selectedProduct = this.products[0].id;
          this.loadProductReviews(this.selectedProduct);
        }
        this.productsLoading = false;
        this.noProducts = this.products.length === 0;
      },
      error: (err) => {
        this.apiError = 'An Error occured while Loading Product Reviews';
        // this._ToastrService.error('Failed to load Products, Please try again.');
        this.productsLoading = false;
      },
    });
  }
  /*-----------------------------------------------------------------*/
  onFilterChange(): void {
    this.fetchProducts(this.currentPage, this.searchInput, this.selectedCategory, this.selectedBrand);
  }
  /*-----------------------------------------------------------------*/
  onSelectChanged() {
    this.loadProductReviews(this.selectedProduct);
  }
  /*------------------------------------------------------------------*/
  // Get Reviews By Product Id
  private loadProductReviews(productId: number): void {
    this.reviewsLoading = true;
    this.apiError = null;
    this._ReviewService.getAllReviewsByProductId(productId).subscribe({
      next: (response: any) => {
        this.reviews = response;
        this.reviewsLoading = false;
        this.noReviews = this.reviews.length === 0;
      },
      error: (error) => {
        this.apiError = 'An Error occured while Loading Product Reviews';
        // this._ToastrService.error('Error fetching Product Reviews by Id, Please try again.');
        this.reviewsLoading = false;
      },
    });
  }
  /*------------------------------------------------------------------*/
}
