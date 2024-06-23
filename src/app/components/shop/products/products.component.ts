import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../../services/product.service';
import { CategoryService } from '../../../services/category.service';
import { BrandService } from '../../../services/brand.service';
import { SizeService } from '../../../services/size.service';
import { ColorService } from '../../../services/color.service';
import { Product } from '../../../models/product';
import { Category } from '../../../models/category';
import { Brand } from '../../../models/brand';
import { Size } from '../../../models/size';
import { Color } from '../../../models/color';
import { PagedResponse } from '../../../models/pagedResponse';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
/*--------------------------------------------------------------------*/
@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrl: './products.component.css',
})
/*--------------------------------------------------------------------*/
export class ProductsComponent implements OnInit {
  // Component properties
  products: Product[] = [];
  categories: Category[] = [];
  brands: Brand[] = [];
  sizes: Size[] = [];
  colors: Color[] = [];
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
  // Additional filters
  selectedCategoryId: number | null = null;
  selectedBrandId: number | null = null;
  selectedColorId: number | null = null;
  selectedSizeId: number | null = null;
  minPrice: number | null = null;
  maxPrice: number | null = null;
  // Loading
  productsLoading: boolean = false;
  categoriesLoading: boolean = false;
  brandsLoading: boolean = false;
  sizesLoading: boolean = false;
  colorsLoading: boolean = false;
  /*-----------------------------------------------------------------*/
  // Ctor
  constructor(
    private _ProductService: ProductService,
    private _CategoryService: CategoryService,
    private _SizeService: SizeService,
    private _ColorService: ColorService,
    private _BrandService: BrandService,
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
    this.loadProdcuts(this.currentPage);
    this.loadCategories();
    this.loadBrands();
    this.loadSizes();
    this.loadColors();
  }
  /*-----------------------------------------------------------------*/
  // Load Products
  async loadProdcuts(
    page: number,
    searchParam?: string,
    categoryId?: number,
    brandId?: number,
    colorId?: number,
    sizeId?: number,
    minPrice?: number,
    maxPrice?: number
  ): Promise<void> {
    this.productsLoading = true;
    this.apiError = null;
    (
      await this._ProductService.getAllProductsWithPaginationForUser(page, this.pageSize, searchParam, categoryId, brandId, colorId, sizeId, minPrice, maxPrice)
    ).subscribe({
      next: (response: PagedResponse<Product>) => {
        this.products = response.items;
        this.currentPage = response.currentPage;
        this.totalPages = response.totalPages;
        this.pageSize = response.pageSize;
        this.totalCount = response.totalCount;
        this.updateEntryRange();
        this.productsLoading = false;
        this.noProducts = this.products.length === 0;
      },
      error: (err) => {
        console.log(err);
        this.apiError = 'Failed to load Products, Please try again.';
        this._ToastrService.error('Failed to load Products, Please try again.');
        this.productsLoading = false;
      },
    });
  }
  /*------------------------------------------------------------------*/
  // Load Categories
  private loadCategories(): void {
    this.categoriesLoading = true;
    this._CategoryService.getAllCategories().subscribe({
      next: (response: { categoriesCount: number; categories: Category[] }) => {
        this.categories = response.categories;
        this.categoriesLoading = false;
      },
      error: (err) => {
        console.error('Failed to load Categories', err);
        this._ToastrService.error('Failed to load Categories, please try again.');
        this.categoriesLoading = false;
      },
    });
  }
  /*-----------------------------------------------------------------*/
  // Load Brands
  private loadBrands(): void {
    this.brandsLoading = true;
    this._BrandService.getAllBrands().subscribe({
      next: (response: { brandsCount: number; brands: Brand[] }) => {
        this.brands = response.brands;
        this.brandsLoading = false;
      },
      error: (err) => {
        this.brandsLoading = false;
        console.error('Failed to load Brands', err);
        this._ToastrService.error('Failed to load Brands, please try again.');
      },
    });
  }
  /*-----------------------------------------------------------------*/
  // Load Sizes
  private loadSizes(): void {
    this.sizesLoading = true;
    this._SizeService.getAllSizes().subscribe({
      next: (response: { sizesCount: number; sizes: Size[] }) => {
        this.sizes = response.sizes;
        this.sizesLoading = false;
      },
      error: (err) => {
        this.sizesLoading = false;
        console.error('Failed to load Sizes', err);
        this._ToastrService.error('Failed to load Sizes, please try again.');
      },
    });
  }
  /*-----------------------------------------------------------------*/
  // Load Colors
  private loadColors(): void {
    this.colorsLoading = true;
    this._ColorService.getAllColors().subscribe({
      next: (response: { colorsCount: number; colors: Color[] }) => {
        this.colors = response.colors;
        this.colorsLoading = false;
      },
      error: (err) => {
        this.colorsLoading = false;
        console.error('Failed to load Colors', err);
        this._ToastrService.error('Failed to load Colors, please try again.');
      },
    });
  }
  /*-----------------------------------------------------------------*/
  // Change Page
  changePage(page: number): void {
    this.productsLoading = true;
    if (page >= 1 && page <= this.totalPages) {
      this.loadProdcuts(page);
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
  // Open Product Details Modal
  // openProductDetailsModal(product: any): void {
  //   const modalRef = this._ModalService.open(AdminProductDetailsModalComponent, { size: 'xl' });
  //   modalRef.componentInstance.product = product;
  // }

  /*-----------------------------------------------------------------*/
  // Search Products
  onSearchInputChanged(searchTerm: string): void {
    this.searchInputChanged.next(searchTerm);
  }
  /*-----------------------------------------------------------------*/
  // Search
  searchProducts(searchTerm: string = this.searchInput.trim()): void {
    this.currentPage = 1;
    this.loadProdcuts(this.currentPage, searchTerm);
  }
  /*-----------------------------------------------------------------*/
  // Reset Filters
  resetFilters(): void {
    this.selectedCategoryId = null;
    this.selectedBrandId = null;
    this.selectedColorId = null;
    this.selectedSizeId = null;
    this.minPrice = null;
    this.maxPrice = null;
    this.currentPage = 1;
    this.loadProdcuts(this.currentPage, this.searchInput);
  }
  /*-----------------------------------------------------------------*/
  // Handle Filter Changes
  onFilterChange(): void {
    this.currentPage = 1;
    this.loadProdcuts(
      this.currentPage,
      this.searchInput,
      this.selectedCategoryId,
      this.selectedBrandId,
      this.selectedColorId,
      this.selectedSizeId,
      this.minPrice,
      this.maxPrice
    );
  }
  /*-----------------------------------------------------------------*/
  onPriceFilterChange(min: number | null, max: number | null): void {
    if (min === null && max === null) {
      this.minPrice = null;
      this.maxPrice = null;
    } else {
      this.minPrice = min;
      this.maxPrice = max;
    }
    this.onFilterChange();
  }
  /*-----------------------------------------------------------------*/
}
