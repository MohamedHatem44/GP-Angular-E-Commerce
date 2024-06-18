import { Component, OnInit } from '@angular/core';
import { Category } from '../../../models/category';
import { CategoryService } from '../../../services/category.service';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
/*--------------------------------------------------------------------*/
@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.css',
})
/*--------------------------------------------------------------------*/
export class CategoriesComponent implements OnInit {
  // Component properties
  categories: Category[] = [];
  currentPage: number = 1;
  totalPages: number;
  pageSize: number;
  totalCount: number;
  maxPagesToShow: number = 3;
  startEntry: number;
  endEntry: number;
  apiError: string | null = null;
  noCategories: boolean = false;
  categoriesLoading: boolean = false;
  searchInput: string = '';
  searchInputChanged: Subject<string> = new Subject<string>();
  /*-----------------------------------------------------------------*/
  // Ctor
  constructor(private _CategoryService: CategoryService, private _ToastrService: ToastrService) {
    this.searchInputChanged.pipe(debounceTime(300), distinctUntilChanged()).subscribe((searchTerm) => {
      this.searchCategories(searchTerm);
    });
  }
  /*-----------------------------------------------------------------*/
  ngOnInit(): void {
    this.categoriesLoading = true;
    this.fetchCategories(this.currentPage);
  }
  /*-----------------------------------------------------------------*/
  // Fetch Categories
  fetchCategories(page: number, categoryName?: string): void {
    this.categoriesLoading = true;
    this.apiError = null;
    this._CategoryService.getAllCategoriesWithPagination(page, 6, categoryName).subscribe({
      next: (response: any) => {
        this.categories = response.items.map((category: Category) => ({ ...category, deleting: false }));
        this.currentPage = response.currentPage;
        this.totalPages = response.totalPages;
        this.pageSize = response.pageSize;
        this.totalCount = response.totalCount;
        this.updateEntryRange();
        this.categoriesLoading = false;
        this.noCategories = this.categories.length === 0;
      },
      error: (err) => {
        this.apiError = 'Failed to load Categories, Please try again.';
        this._ToastrService.error('Failed to load Categories, Please try again.');
        this.categoriesLoading = false;
      },
    });
  }
  /*-----------------------------------------------------------------*/
  // Change Page
  changePage(page: number): void {
    this.categoriesLoading = true;
    if (page >= 1 && page <= this.totalPages) {
      this.fetchCategories(page);
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
  // Search Categories
  onSearchInputChanged(searchTerm: string): void {
    this.searchInputChanged.next(searchTerm);
  }
  /*-----------------------------------------------------------------*/
  // Search
  searchCategories(searchTerm: string = this.searchInput.trim()): void {
    this.fetchCategories(this.currentPage, searchTerm);
  }
  /*-----------------------------------------------------------------*/
}
