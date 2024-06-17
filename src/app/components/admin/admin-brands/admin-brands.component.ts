import { Component } from '@angular/core';
import { BrandService } from '../../../services/brand.service';
import { Brand } from '../../../models/brand';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { DeleteConfirmationModalComponent } from '../../shared/delete-confirmation-modal/delete-confirmation-modal.component';
import { AdminBrandDetailsModelComponent } from '../admin-brand-details-model/admin-brand-details-model.component';
/*--------------------------------------------------------------------*/
@Component({
  selector: 'app-admin-brands',
  templateUrl: './admin-brands.component.html',
  styleUrl: './admin-brands.component.css',
})
/*--------------------------------------------------------------------*/
export class AdminBrandsComponent {
  // Component properties
  brandsLoading: boolean = false;
  brandIdToDelete: number;
  brands: (Brand & { deleting?: boolean })[] = [];
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
  /*-----------------------------------------------------------------*/
  // Ctor
  constructor(private _BrandService: BrandService, private _ModalService: NgbModal, private _ToastrService: ToastrService) {}
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
    this._BrandService.getAllBrandsWithPagination(page, this.pageSize, brandName).subscribe({
      next: (response: any) => {
        console.log(response);
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
        this.apiError = 'Failed to load Brands. Please try again.';
        this.brandsLoading = false;
      },
    });
  }
  /*-----------------------------------------------------------------*/
  changePage(page: number): void {
    this.brandsLoading = true;
    if (page >= 1 && page <= this.totalPages) {
      this.fetchBrands(page);
    }
  }
  /*-----------------------------------------------------------------*/
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
    /*-----------------------------------------------------------------*/
    const pages = [];
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  }
  /*-----------------------------------------------------------------*/
  openDeleteConfirmationModal(brandId: number): void {
    const modalRef = this._ModalService.open(DeleteConfirmationModalComponent);
    this.brandIdToDelete = brandId;
    modalRef.componentInstance.message = `Are you sure you want to delete this Brand?`;
    modalRef.componentInstance.confirmDelete.subscribe(() => {
      this.deleteBrand(brandId);
    });
  }
  /*-----------------------------------------------------------------*/
  openBrandDetailsModal(brand: Brand): void {
    const modalRef = this._ModalService.open(AdminBrandDetailsModelComponent);
    modalRef.componentInstance.message = brand;
  }
  /*-----------------------------------------------------------------*/
  deleteBrand(brandId: number): void {
    const message = this.brands.find((msg) => msg.id === brandId);
    if (message) {
      message.deleting = true;
      this._BrandService.deleteBrand(brandId).subscribe({
        next: () => {
          this.brands = this.brands.filter((brand) => brand.id !== brandId);
          this.totalCount--;

          if (this.brands.length === 0 && this.currentPage > 1) {
            this.currentPage--;
          }
          this.updateEntryRange();
          this.fetchBrands(this.currentPage);
          this._ToastrService.success('Brand deleted successfully');
        },
        error: (err) => {
          this._ToastrService.error('Failed to delete Brand. Please try again');
          message.deleting = false;
        },
      });
    }
  }
  /*-----------------------------------------------------------------*/
  searchBrands(): void {
    this.fetchBrands(this.currentPage, this.searchInput.trim());
  }
  /*-----------------------------------------------------------------*/
}
