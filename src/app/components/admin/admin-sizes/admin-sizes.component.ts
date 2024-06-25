import { Component, OnInit } from '@angular/core';
import { Size } from '../../../models/size';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';
import { SizeService } from '../../../services/size.service';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { DeleteConfirmationModalComponent } from '../../modals/delete-confirmation-modal/delete-confirmation-modal.component';
import { PagedResponse } from '../../../models/pagedResponse';
/*--------------------------------------------------------------------*/
@Component({
  selector: 'app-admin-sizes',
  templateUrl: './admin-sizes.component.html',
  styleUrl: './admin-sizes.component.css',
})
/*--------------------------------------------------------------------*/
export class AdminSizesComponent implements OnInit {
  // Component properties
  sizesLoading: boolean = false;
  sizeIdToDelete: number;
  sizes: (Size & { deleting?: boolean })[] = [];
  currentPage: number = 1;
  totalPages: number;
  pageSize: number;
  totalCount: number;
  maxPagesToShow: number = 3;
  startEntry: number;
  endEntry: number;
  apiError: string | null = null;
  noSizes: boolean = false;
  searchInput: string = '';
  searchInputChanged: Subject<string> = new Subject<string>();
  /*-----------------------------------------------------------------*/
  // Ctor
  constructor(private _SizeService: SizeService, private _Router: Router, private _ModalService: NgbModal, private _ToastrService: ToastrService) {
    this.searchInputChanged.pipe(debounceTime(300), distinctUntilChanged()).subscribe((searchTerm) => {
      this.searchSizes(searchTerm);
    });
  }
  /*-----------------------------------------------------------------*/
  // Ng OnInit
  ngOnInit(): void {
    this.sizesLoading = true;
    this.fetchSizes(this.currentPage);
  }
  /*-----------------------------------------------------------------*/
  // Fetch Sizes
  fetchSizes(page: number, sizeName?: string): void {
    this.sizesLoading = true;
    this.apiError = null;
    this._SizeService.getAllSizesWithPagination(page, this.pageSize, sizeName).subscribe({
      next: (response: PagedResponse<Size>) => {
        this.sizes = response.items.map((size: Size) => ({ ...size, deleting: false }));
        this.currentPage = response.currentPage;
        this.totalPages = response.totalPages;
        this.pageSize = response.pageSize;
        this.totalCount = response.totalCount;
        this.updateEntryRange();
        this.sizesLoading = false;
        this.noSizes = this.sizes.length === 0;
      },
      error: (err) => {
        this.apiError = 'Failed to load Sizes, Please try again.';
        this._ToastrService.error('Failed to load Sizes, Please try again.');
        this.sizesLoading = false;
      },
    });
  }
  /*-----------------------------------------------------------------*/
  // Change Page
  changePage(page: number): void {
    this.sizesLoading = true;
    if (page >= 1 && page <= this.totalPages) {
      this.fetchSizes(page);
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
  openDeleteConfirmationModal(sizeId: number): void {
    const modalRef = this._ModalService.open(DeleteConfirmationModalComponent);
    this.sizeIdToDelete = sizeId;
    modalRef.componentInstance.message = `Are you sure you want to delete this Size?`;
    modalRef.componentInstance.confirmDelete.subscribe(() => {
      this.deleteSize(sizeId);
    });
  }
  /*-----------------------------------------------------------------*/
  // Delete Size
  deleteSize(sizeId: number): void {
    const size = this.sizes.find((size) => size.id === sizeId);
    if (size) {
      size.deleting = true;
      this._SizeService.deleteSize(sizeId).subscribe({
        next: () => {
          this.sizes = this.sizes.filter((size) => size.id !== sizeId);
          this.totalCount--;

          if (this.sizes.length === 0 && this.currentPage > 1) {
            this.currentPage--;
          }
          this.updateEntryRange();
          this.fetchSizes(this.currentPage);
          this._ToastrService.success('Size deleted successfully');
        },
        error: (err) => {
          this._ToastrService.error('Failed to delete Size, Please try again.');
          size.deleting = false;
        },
      });
    }
  }
  /*-----------------------------------------------------------------*/
  // Search Sizes
  onSearchInputChanged(searchTerm: string): void {
    this.searchInputChanged.next(searchTerm);
  }
  /*-----------------------------------------------------------------*/
  // Search
  searchSizes(searchTerm: string = this.searchInput.trim()): void {
    this.currentPage = 1;
    this.fetchSizes(this.currentPage, searchTerm);
  }
  /*-----------------------------------------------------------------*/
  // Edit Size
  editSize(sizeId: number) {
    this._Router.navigate([`/admindashboard/editsize/${sizeId}`]);
  }
  /*-----------------------------------------------------------------*/
}
