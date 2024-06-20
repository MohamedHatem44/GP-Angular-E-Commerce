import { Component, OnInit } from '@angular/core';
import { Color } from '../../../models/color';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';
import { ColorService } from '../../../services/color.service';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { DeleteConfirmationModalComponent } from '../../modals/delete-confirmation-modal/delete-confirmation-modal.component';
/*--------------------------------------------------------------------*/
@Component({
  selector: 'app-admin-colors',
  templateUrl: './admin-colors.component.html',
  styleUrl: './admin-colors.component.css',
})
/*--------------------------------------------------------------------*/
export class AdminColorsComponent implements OnInit {
  // Component properties
  colorsLoading: boolean = false;
  colorIdToDelete: number;
  colors: (Color & { deleting?: boolean })[] = [];
  currentPage: number = 1;
  totalPages: number;
  pageSize: number;
  totalCount: number;
  maxPagesToShow: number = 3;
  startEntry: number;
  endEntry: number;
  apiError: string | null = null;
  noColors: boolean = false;
  searchInput: string = '';
  searchInputChanged: Subject<string> = new Subject<string>();
  /*-----------------------------------------------------------------*/
  // Ctor
  constructor(private _ColorService: ColorService, private _Router: Router, private _ModalService: NgbModal, private _ToastrService: ToastrService) {
    this.searchInputChanged.pipe(debounceTime(300), distinctUntilChanged()).subscribe((searchTerm) => {
      this.searchColors(searchTerm);
    });
  }
  /*-----------------------------------------------------------------*/
  // Ng OnInit
  ngOnInit(): void {
    this.colorsLoading = true;
    this.fetchColors(this.currentPage);
  }
  /*-----------------------------------------------------------------*/
  // Fetch Colors
  fetchColors(page: number, colorName?: string): void {
    this.colorsLoading = true;
    this.apiError = null;
    this._ColorService.getAllColorsWithPagination(page, this.pageSize, colorName).subscribe({
      next: (response: any) => {
        this.colors = response.items.map((color: Color) => ({ ...color, deleting: false }));
        this.currentPage = response.currentPage;
        this.totalPages = response.totalPages;
        this.pageSize = response.pageSize;
        this.totalCount = response.totalCount;
        this.updateEntryRange();
        this.colorsLoading = false;
        this.noColors = this.colors.length === 0;
      },
      error: (err) => {
        this.apiError = 'Failed to load Colors, Please try again.';
        this._ToastrService.error('Failed to load Colors, Please try again.');
        this.colorsLoading = false;
      },
    });
  }
  /*-----------------------------------------------------------------*/
  // Change Page
  changePage(page: number): void {
    this.colorsLoading = true;
    if (page >= 1 && page <= this.totalPages) {
      this.fetchColors(page);
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
  openDeleteConfirmationModal(colorId: number): void {
    const modalRef = this._ModalService.open(DeleteConfirmationModalComponent);
    this.colorIdToDelete = colorId;
    modalRef.componentInstance.message = `Are you sure you want to delete this Color?`;
    modalRef.componentInstance.confirmDelete.subscribe(() => {
      this.deleteColor(colorId);
    });
  }
  /*-----------------------------------------------------------------*/
  // Delete Color
  deleteColor(colorId: number): void {
    const color = this.colors.find((color) => color.id === colorId);
    if (color) {
      color.deleting = true;
      this._ColorService.deleteColor(colorId).subscribe({
        next: () => {
          this.colors = this.colors.filter((color) => color.id !== colorId);
          this.totalCount--;

          if (this.colors.length === 0 && this.currentPage > 1) {
            this.currentPage--;
          }
          this.updateEntryRange();
          this.fetchColors(this.currentPage);
          this._ToastrService.success('Color deleted successfully');
        },
        error: (err) => {
          this._ToastrService.error('Failed to delete Color, Please try again.');
          color.deleting = false;
        },
      });
    }
  }
  /*-----------------------------------------------------------------*/
  // Search Colors
  onSearchInputChanged(searchTerm: string): void {
    this.searchInputChanged.next(searchTerm);
  }
  /*-----------------------------------------------------------------*/
  // Search
  searchColors(searchTerm: string = this.searchInput.trim()): void {
    this.fetchColors(1, searchTerm);
  }
  /*-----------------------------------------------------------------*/
  // Edit Color
  editColor(colorId: number) {
    this._Router.navigate([`/admindashboard/editcolor/${colorId}`]);
  }
  /*-----------------------------------------------------------------*/
}
