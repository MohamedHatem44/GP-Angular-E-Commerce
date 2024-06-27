import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../../services/product.service';
import { CategoryService } from '../../../services/category.service';
import { BrandService } from '../../../services/brand.service';
import { SizeService } from '../../../services/size.service';
import { ColorService } from '../../../services/color.service';
import { ExtendedProduct, Product } from '../../../models/product';
import { Category } from '../../../models/category';
import { Brand } from '../../../models/brand';
import { Size } from '../../../models/size';
import { Color } from '../../../models/color';
import { PagedResponse } from '../../../models/pagedResponse';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ProductDetailsModalComponent } from '../product-details-modal/product-details-modal.component';
import { WishListService } from '../../../services/wishList.service';
import { WishList } from '../../../models/wishList';
import { ActivatedRoute } from '@angular/router';
/*--------------------------------------------------------------------*/
@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrl: './products.component.css',
})
/*--------------------------------------------------------------------*/
export class ProductsComponent implements OnInit {
  // Component properties
  products: ExtendedProduct[] = [];
  categories: Category[] = [];
  brands: Brand[] = [];
  sizes: Size[] = [];
  colors: Color[] = [];
  currentPage: number = 1;
  totalPages: number;
  pageSize: number = 9;
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
  productId: number = null;
  wishList: any;
  wishListItems: any[] = [];
  /*-----------------------------------------------------------------*/
  // Ctor
  constructor(
    private _ProductService: ProductService,
    private _CategoryService: CategoryService,
    private _SizeService: SizeService,
    private _ColorService: ColorService,
    private _BrandService: BrandService,
    private _ModalService: NgbModal,
    private _ToastrService: ToastrService,
    private _WishListService: WishListService,
    private route: ActivatedRoute
  ) {
    this.searchInputChanged.pipe(debounceTime(300), distinctUntilChanged()).subscribe((searchTerm) => {
      this.searchProducts(searchTerm);
    });
  }
  /*-----------------------------------------------------------------*/
  // Ng OnInit
  ngOnInit(): void {
    this.productsLoading = true;
    this.route.paramMap.subscribe((params) => {
      this.selectedCategoryId = Number(params.get('categoryId'));
    });

    this.loadWishList().then(() => {
      if (this.selectedCategoryId !== 0) {
        this.loadProducts(this.currentPage, this.searchInput, this.selectedCategoryId);
      } else {
        this.loadProducts(this.currentPage);
      }
    });
    this.loadCategories();
    this.loadBrands();
    this.loadSizes();
    this.loadColors();
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
          this.apiError = 'Failed to load WishList, Please try again.';
          reject(err);
        },
      });
    });
  }
  /*-----------------------------------------------------------------*/
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
      this.loadProducts(page);
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
  openProductDetailsModal(product: any): void {
    const modalRef = this._ModalService.open(ProductDetailsModalComponent, { size: 'xl' });
    modalRef.componentInstance.product = product;
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
    this.loadProducts(this.currentPage, searchTerm);
  }
  /*-----------------------------------------------------------------*/
  // Reset Filters
  resetFilters(): void {
    this.searchInput = '';
    this.selectedCategoryId = null;
    this.selectedBrandId = null;
    this.selectedColorId = null;
    this.selectedSizeId = null;
    this.minPrice = null;
    this.maxPrice = null;
    this.currentPage = 1;
    this.loadProducts(this.currentPage);
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
  // Handle Filter Changes
  onFilterChange(): void {
    this.currentPage = 1;
    this.loadProducts(
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
  // Add / Remove from WishList
  addToWishList(product: ExtendedProduct) {
    product.isWishListLoading = true;
    const itemIdToAdd: WishList = {
      productId: product.id,
    };
    const isCurrentlyInWishList = product.isInWishList;
    this._WishListService.AddAndRemoveFromWishList(itemIdToAdd).subscribe({
      next: (response: any) => {
        if (isCurrentlyInWishList) {
          this._ToastrService.success('Product removed from wish list successfully');
        } else {
          this._ToastrService.success('Product added to wish list successfully');
        }
        product.isWishListLoading = false;
        this.updateProductWishListState(product.id);
      },
      error: (error) => {
        if (error.status === 400) {
          this._ToastrService.error('This Product Not Found');
        } else {
          this._ToastrService.error('Failed to add/remove item to/from wish list');
        }
        product.isWishListLoading = false;
      },
    });
  }
  /*-----------------------------------------------------------------*/
  private updateProductWishListState(productId: number): void {
    const index = this.products.findIndex((product) => product.id === productId);
    if (index !== -1) {
      this.products[index].isInWishList = !this.products[index].isInWishList;
    }
  }
  /*-----------------------------------------------------------------*/
  private isProductInWishList(productId: number): boolean {
    return this.wishListItems.some((item) => item.productId === productId);
  }
  /*-----------------------------------------------------------------*/
  // Load Products
  loadProducts(
    page: number,
    searchParam?: string,
    categoryId?: number,
    brandId?: number,
    colorId?: number,
    sizeId?: number,
    minPrice?: number,
    maxPrice?: number
  ): void {
    this.productsLoading = true;
    this.apiError = null;
    console.log(minPrice, maxPrice);
    this._ProductService
      .getAllProductsWithPaginationForUser(page, this.pageSize, searchParam, categoryId, brandId, colorId, sizeId, minPrice, maxPrice)
      .subscribe({
        next: (response: PagedResponse<ExtendedProduct>) => {
          console.log(response.items);
          this.products = response.items.map((product) => ({
            ...product,
            isInWishList: this.isProductInWishList(product.id),
            isWishListLoading: false,
          }));
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
}
