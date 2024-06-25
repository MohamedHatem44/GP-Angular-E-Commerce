import { Component, OnInit } from '@angular/core';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';
import { ProductService } from '../../../services/product.service';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DeleteConfirmationModalComponent } from '../../modals/delete-confirmation-modal/delete-confirmation-modal.component';
import { ImgModalComponent } from '../../modals/img-modal/img-modal.component';
import { ToastrService } from 'ngx-toastr';
import { AdminProductDetailsModalComponent } from '../admin-product-details-modal/admin-product-details-modal.component';
import { Category } from '../../../models/category';
import { Brand } from '../../../models/brand';
import { CategoryService } from '../../../services/category.service';
import { BrandService } from '../../../services/brand.service';
import { PagedResponse } from '../../../models/pagedResponse';
import { Product } from '../../../models/product';
/*--------------------------------------------------------------------*/
@Component({
  selector: 'app-admin-products',
  templateUrl: './admin-products.component.html',
  styleUrl: './admin-products.component.css',
})
/*--------------------------------------------------------------------*/
export class AdminProductsComponent implements OnInit {
  // Component properties
  productsLoading: boolean = false;
  productIdToDelete: number;
  products: (any & { deleting?: boolean })[] = [];
  currentPage: number = 1;
  totalPages: number;
  pageSize: number;
  totalCount: number;
  maxPagesToShow: number = 3;
  startEntry: number;
  endEntry: number;
  apiError: string | null = null;
  noProducts: boolean = false;
  searchInput: string = '';
  searchInputChanged: Subject<string> = new Subject<string>();
  categories: Category[] = [];
  brands: Brand[] = [];
  selectedCategory: number | null = null;
  selectedBrand: number | null = null;
  /*-----------------------------------------------------------------*/
  // Ctor
  constructor(
    private _ProductService: ProductService,
    private _CategoryService: CategoryService,
    private _BrandService: BrandService,
    private _Router: Router,
    private _ModalService: NgbModal,
    private _ToastrService: ToastrService
  ) {
    this.searchInputChanged.pipe(debounceTime(300), distinctUntilChanged()).subscribe((searchTerm) => {
      this.searchProducts(searchTerm);
    });
  }
  /*-----------------------------------------------------------------*/
  // Ng OnInit
  ngOnInit(): void {
    this.productsLoading = true;
    this.fetchProducts(this.currentPage);
    this.loadCategories();
    this.loadBrands();
    this.selectedCategory = null;
    this.selectedBrand = null;
  }
  /*-----------------------------------------------------------------*/
  // Fetch Products
  async fetchProducts(page: number, searchParam?: string, categoryId?: number, brandId?: number): Promise<void> {
    this.productsLoading = true;
    this.apiError = null;
    (await this._ProductService.getAllProductsWithPaginationForAdmin(page, this.pageSize, searchParam, categoryId, brandId)).subscribe({
      next: (response: PagedResponse<Product>) => {
        this.products = response.items.map((product: any) => ({ ...product, deleting: false }));
        this.currentPage = response.currentPage;
        this.totalPages = response.totalPages;
        this.pageSize = response.pageSize;
        this.totalCount = response.totalCount;
        this.updateEntryRange();
        this.productsLoading = false;
        this.noProducts = this.products.length === 0;
      },
      error: (err) => {
        this.apiError = 'Failed to load Products, Please try again.';
        this._ToastrService.error('Failed to load Products, Please try again.');
        this.productsLoading = false;
      },
    });
  }
  /*-----------------------------------------------------------------*/
  loadCategories(): void {
    this._CategoryService.getAllCategories().subscribe({
      next: (response: any) => {
        this.categories = response.categories;
      },
      error: (err) => {
        console.error('Failed to load categories', err);
        this._ToastrService.error('Failed to load categories, please try again.');
      },
    });
  }
  /*-----------------------------------------------------------------*/
  loadBrands(): void {
    this._BrandService.getAllBrands().subscribe({
      next: (response: any) => {
        this.brands = response.brands;
      },
      error: (err) => {
        console.error('Failed to load brands', err);
        this._ToastrService.error('Failed to load brands, please try again.');
      },
    });
  }
  /*-----------------------------------------------------------------*/
  onFilterChange(): void {
    this.currentPage = 1;
    this.fetchProducts(this.currentPage, this.searchInput, this.selectedCategory, this.selectedBrand);
  }
  /*-----------------------------------------------------------------*/
  // Change Page
  changePage(page: number): void {
    this.productsLoading = true;
    if (page >= 1 && page <= this.totalPages) {
      this.fetchProducts(page);
    }
  }
  /*-----------------------------------------------------------------*/
  // Update Entry Range
  updateEntryRange(): void {
    this.startEntry = (this.currentPage - 1) * this.pageSize + 1;
    this.endEntry = Math.min(this.startEntry + this.pageSize - 1, this.totalCount);
  }
  /*-----------------------------------------------------------------*/
  get pages(): number[] {
    const half = Math.floor(this.maxPagesToShow / 2);
    let start = Math.max(this.currentPage - half, 1);
    let end = start + this.maxPagesToShow - 1;

    if (end > this.totalPages) {
      end = this.totalPages;
      start = Math.max(end - this.maxPagesToShow + 1, 1);
    }
    const pages = [];
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  }
  /*-----------------------------------------------------------------*/
  // Open Delete Confirmation Modal
  openDeleteConfirmationModal(productId: number): void {
    const modalRef = this._ModalService.open(DeleteConfirmationModalComponent);
    this.productIdToDelete = productId;
    modalRef.componentInstance.message = `Are you sure you want to delete this Product?`;
    modalRef.componentInstance.confirmDelete.subscribe(() => {
      this.deleteProduct(productId);
    });
  }
  /*-----------------------------------------------------------------*/
  // Open Product Details Modal
  openProductDetailsModal(product: any): void {
    const modalRef = this._ModalService.open(AdminProductDetailsModalComponent, { size: 'xl' });
    modalRef.componentInstance.product = product;
  }
  /*-----------------------------------------------------------------*/
  // Open Img Modal
  openImgModal(product: any): void {
    const modalRef = this._ModalService.open(ImgModalComponent);
    modalRef.componentInstance.model = product;
  }
  /*-----------------------------------------------------------------*/
  // Delete Product
  deleteProduct(productId: number): void {
    const product = this.products.find((product) => product.id === productId);
    if (product) {
      product.deleting = true;
      this._ProductService.deleteProduct(productId).subscribe({
        next: () => {
          this.products = this.products.filter((product) => product.id !== productId);
          this.totalCount--;

          if (this.products.length === 0 && this.currentPage > 1) {
            this.currentPage--;
          }
          this.updateEntryRange();
          this.fetchProducts(this.currentPage);
          this._ToastrService.success('Product deleted successfully');
        },
        error: (err) => {
          this._ToastrService.error('Failed to delete Product, Please try again.');
          product.deleting = false;
        },
      });
    }
  }
  /*-----------------------------------------------------------------*/
  // Search Products
  onSearchInputChanged(searchTerm: string): void {
    this.searchInputChanged.next(searchTerm);
  }
  /*-----------------------------------------------------------------*/
  // Search
  searchProducts(searchTerm: string = this.searchInput.trim()): void {
    this.currentPage = 1;
    this.fetchProducts(this.currentPage, searchTerm);
  }
  /*-----------------------------------------------------------------*/
  // Edit Product
  editProduct(productId: number) {
    this._Router.navigate([`/admindashboard/editproduct/${productId}`]);
  }
  /*-----------------------------------------------------------------*/
}
