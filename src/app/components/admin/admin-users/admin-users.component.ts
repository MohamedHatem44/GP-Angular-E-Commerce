import { Component, OnInit } from '@angular/core';
import { User } from '../../../models/user';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';
import { UserService } from '../../../services/user.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { DeleteConfirmationModalComponent } from '../../modals/delete-confirmation-modal/delete-confirmation-modal.component';
import { AdminUserDetailsModalComponent } from '../admin-user-details-modal/admin-user-details-modal.component';
import { ImgModalComponent } from '../../modals/img-modal/img-modal.component';
/*--------------------------------------------------------------------*/
@Component({
  selector: 'app-admin-users',
  templateUrl: './admin-users.component.html',
  styleUrl: './admin-users.component.css',
})
/*--------------------------------------------------------------------*/
export class AdminUsersComponent implements OnInit {
  // Component properties
  usersLoading: boolean = false;
  userIdToDelete: string;
  users: (User & { deleting?: boolean; toggleLoading?: boolean })[] = [];
  currentPage: number = 1;
  totalPages: number;
  pageSize: number;
  totalCount: number;
  maxPagesToShow: number = 3;
  startEntry: number;
  endEntry: number;
  apiError: string | null = null;
  noUsers: boolean = false;
  searchInput: string = '';
  searchInputChanged: Subject<string> = new Subject<string>();
  /*-----------------------------------------------------------------*/
  // Ctor
  constructor(private _UserService: UserService, private _ModalService: NgbModal, private _ToastrService: ToastrService) {
    this.searchInputChanged.pipe(debounceTime(300), distinctUntilChanged()).subscribe((searchTerm) => {
      this.searchUsers(searchTerm);
    });
  }
  /*-----------------------------------------------------------------*/
  // Ng OnInit
  ngOnInit(): void {
    this.usersLoading = true;
    this.fetchUsers(this.currentPage);
  }
  /*-----------------------------------------------------------------*/
  // Fetch Brands
  fetchUsers(page: number, name?: string): void {
    this.usersLoading = true;
    this.apiError = null;
    this._UserService.getAllUsersWithPagination(page, this.pageSize, name).subscribe({
      next: (response: any) => {
        this.users = response.items.map((user: User) => ({ ...user, deleting: false }));
        this.currentPage = response.currentPage;
        this.totalPages = response.totalPages;
        this.pageSize = response.pageSize;
        this.totalCount = response.totalCount;
        this.updateEntryRange();
        this.usersLoading = false;
        this.noUsers = this.users.length === 0;
      },
      error: (err) => {
        this.apiError = 'Failed to load Users, Please try again.';
        this._ToastrService.error('Failed to load Users, Please try again.');
        this.usersLoading = false;
      },
    });
  }
  /*-----------------------------------------------------------------*/
  // Change Page
  changePage(page: number): void {
    this.usersLoading = false;
    if (page >= 1 && page <= this.totalPages) {
      this.fetchUsers(page);
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
  openDeleteConfirmationModal(userId: string): void {
    const modalRef = this._ModalService.open(DeleteConfirmationModalComponent);
    this.userIdToDelete = userId;
    modalRef.componentInstance.message = `Are you sure you want to delete this User?`;
    modalRef.componentInstance.confirmDelete.subscribe(() => {
      this.deleteUser(userId);
    });
  }
  /*-----------------------------------------------------------------*/
  // Open User Details Modal
  openUserDetailsModal(user: User): void {
    const modalRef = this._ModalService.open(AdminUserDetailsModalComponent, { size: 'lg' });
    modalRef.componentInstance.user = user;
  }
  /*-----------------------------------------------------------------*/
  // Open Img Modal
  openImgModal(user: User): void {
    const modalRef = this._ModalService.open(ImgModalComponent);
    modalRef.componentInstance.model = user;
  }
  /*-----------------------------------------------------------------*/
  // Delete User
  deleteUser(userId: string): void {
    const user = this.users.find((user) => user.id === userId);
    if (user) {
      user.deleting = true;
      this._UserService.deleteUser(userId).subscribe({
        next: () => {
          this.users = this.users.filter((user) => user.id !== userId);
          this.totalCount--;
          if (this.users.length === 0 && this.currentPage > 1) {
            this.currentPage--;
          }
          this.updateEntryRange();
          this.fetchUsers(this.currentPage);
          this._ToastrService.success('User deleted successfully');
        },
        error: (err) => {
          this._ToastrService.error('Failed to delete User, Please try again.');
          user.deleting = false;
        },
      });
    }
  }
  /*-----------------------------------------------------------------*/
  // Search Users
  onSearchInputChanged(searchTerm: string): void {
    this.searchInputChanged.next(searchTerm);
  }
  /*-----------------------------------------------------------------*/
  // Search
  searchUsers(searchTerm: string = this.searchInput.trim()): void {
    this.currentPage = 1;
    this.fetchUsers(this.currentPage, searchTerm);
  }
  /*-----------------------------------------------------------------*/
  // Toggle Active Status
  toggleActiveStatus(userId: string): void {
    const user = this.users.find((user) => user.id === userId);
    if (user) {
      user.toggleLoading = true;
      this._UserService.toggleActiveStatus(userId).subscribe({
        next: () => {
          user.toggleLoading = false;
          this._ToastrService.success(`User active status toggled successfully for user with ID ${userId}`);
          user.active = !user.active;
        },
        error: (error) => {
          user.toggleLoading = false;
          this._ToastrService.error('Failed to toggle status, Please try again.');
        },
      });
    }
  }
  /*-----------------------------------------------------------------*/
}
