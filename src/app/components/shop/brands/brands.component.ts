import { Component, OnInit } from '@angular/core';
import { Brand } from '../../../models/brand';
import { BrandService } from '../../../services/brand.service';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
/*--------------------------------------------------------------------*/
@Component({
  selector: 'app-brands',
  templateUrl: './brands.component.html',
  styleUrl: './brands.component.css',
})
/*--------------------------------------------------------------------*/
export class BrandsComponent implements OnInit {
  // Component properties
  brands: Brand[] = [];
  brandsLoading: boolean = false;
  currentPage: number = 1;
  totalPages: number;
  pageSize: number;
  totalCount: number;
  maxPagesToShow: number = 3;
  startEntry: number;
  endEntry: number;
  apiError: string | null = null;
  noBrands: boolean = false;
  searchInput: string = '';
  searchInputChanged: Subject<string> = new Subject<string>();
  /*-----------------------------------------------------------------*/
  // Ctor
  constructor(private _BrandService: BrandService, private _ToastrService: ToastrService) {
    this.searchInputChanged.pipe(debounceTime(300), distinctUntilChanged()).subscribe((searchTerm) => {
      this.searchBrands(searchTerm);
    });
  }
  /*-----------------------------------------------------------------*/
  ngOnInit(): void {
    this.brandsLoading = true;
    this.fetchBrands(this.currentPage);
  }
  /*-----------------------------------------------------------------*/
  // Fetch Brands
  fetchBrands(page: number, brandName?: string): void {
    this.brandsLoading = true;
    this.apiError = null;
    this._BrandService.getAllBrandsWithPagination(page, 6, brandName).subscribe({
      next: (response: any) => {
        this.brands = response.items.map((brand: Brand) => ({ ...brand, deleting: false }));
        this.currentPage = response.currentPage;
        this.totalPages = response.totalPages;
        this.pageSize = response.pageSize;
        this.totalCount = response.totalCount;
        this.updateEntryRange();
        this.brandsLoading = false;
        this.noBrands = this.brands.length === 0;
      },
      error: (err) => {
        this.apiError = 'Failed to load Brands, Please try again.';
        this._ToastrService.error('Failed to load Brands, Please try again.');
        this.brandsLoading = false;
      },
    });
  }
  /*-----------------------------------------------------------------*/
  // Change Page
  changePage(page: number): void {
    this.brandsLoading = true;
    if (page >= 1 && page <= this.totalPages) {
      this.fetchBrands(page);
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
  // Search Brands
  onSearchInputChanged(searchTerm: string): void {
    this.searchInputChanged.next(searchTerm);
  }
  /*-----------------------------------------------------------------*/
  // Search
  searchBrands(searchTerm: string = this.searchInput.trim()): void {
    this.fetchBrands(this.currentPage, searchTerm);
  }
  /*-----------------------------------------------------------------*/
}
