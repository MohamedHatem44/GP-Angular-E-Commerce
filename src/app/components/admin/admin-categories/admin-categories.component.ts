import { Component, OnInit } from '@angular/core';
import { CategoryService } from '../../../services/category.service';
import { Category } from '../../../models/category';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { DeleteConfirmationModalComponent } from '../../modals/delete-confirmation-modal/delete-confirmation-modal.component';
import { AdminCategoryDetailsModelComponent } from '../admin-category-details-model/admin-category-details-model.component';
import { ImgModalComponent } from '../../modals/img-modal/img-modal.component';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';
/*--------------------------------------------------------------------*/
@Component({
  selector: 'app-admin-categories',
  templateUrl: './admin-categories.component.html',
  styleUrl: './admin-categories.component.css',
})
/*--------------------------------------------------------------------*/
export class AdminCategoriesComponent implements OnInit {
  // Component properties
  categoriesLoading: boolean = false;
  categoryIdToDelete: number;
  categories: (Category & { deleting?: boolean })[] = [];
  currentPage: number = 1;
  totalPages: number;
  pageSize: number;
  totalCount: number;
  maxPagesToShow: number = 3;
  startEntry: number;
  endEntry: number;
  apiError: string | null = null;
  noCategories: boolean = false;
  searchInput: string = '';
  searchInputChanged: Subject<string> = new Subject<string>();
  /*-----------------------------------------------------------------*/
  // Ctor
  constructor(private _CategoryService: CategoryService, private _Router: Router, private _ModalService: NgbModal, private _ToastrService: ToastrService) {
    this.searchInputChanged.pipe(debounceTime(300), distinctUntilChanged()).subscribe((searchTerm) => {
      this.searchCategories(searchTerm);
    });
  }
  /*-----------------------------------------------------------------*/
  // Ng OnInit
  ngOnInit(): void {
    this.categoriesLoading = true;
    this.fetchCategories(this.currentPage);
  }
  /*-----------------------------------------------------------------*/
  // Fetch Categories
  fetchCategories(page: number, categoryName?: string): void {
    this.categoriesLoading = true;
    this.apiError = null;
    this._CategoryService.getAllCategoriesWithPagination(page, this.pageSize, categoryName).subscribe({
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
  // Open Delete Confirmation Modal
  openDeleteConfirmationModal(categoryId: number): void {
    const modalRef = this._ModalService.open(DeleteConfirmationModalComponent);
    this.categoryIdToDelete = categoryId;
    modalRef.componentInstance.message = `Are you sure you want to delete this Category?`;
    modalRef.componentInstance.confirmDelete.subscribe(() => {
      this.deleteCategory(categoryId);
    });
  }
  /*-----------------------------------------------------------------*/
  // Open Category Details Modal
  openCategoryDetailsModal(category: Category): void {
    const modalRef = this._ModalService.open(AdminCategoryDetailsModelComponent, { size: 'lg' });
    modalRef.componentInstance.category = category;
  }
  /*-----------------------------------------------------------------*/
  // Open Img Modal
  openImgModal(category: Category): void {
    const modalRef = this._ModalService.open(ImgModalComponent);
    modalRef.componentInstance.model = category;
  }
  /*-----------------------------------------------------------------*/
  // Delete Category
  deleteCategory(categoryId: number): void {
    const message = this.categories.find((category) => category.id === categoryId);
    if (message) {
      message.deleting = true;
      this._CategoryService.deleteCategory(categoryId).subscribe({
        next: () => {
          this.categories = this.categories.filter((category) => category.id !== categoryId);
          this.totalCount--;

          if (this.categories.length === 0 && this.currentPage > 1) {
            this.currentPage--;
          }
          this.updateEntryRange();
          this.fetchCategories(this.currentPage);
          this._ToastrService.success('Category deleted successfully');
        },
        error: (err) => {
          this._ToastrService.error('Failed to delete Category, Please try again.');
          message.deleting = false;
        },
      });
    }
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
  // Edit Category
  editCategory(categoryId: number) {
    this._Router.navigate([`/admindashboard/editcategory/${categoryId}`]);
  }
  /*-----------------------------------------------------------------*/
}
