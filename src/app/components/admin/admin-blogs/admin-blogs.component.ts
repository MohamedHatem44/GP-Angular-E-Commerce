import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { BlogService } from '../../../services/blog.service';
import { Blog } from '../../../models/blog';
import { PagedResponse } from '../../../models/pagedResponse';
import { DeleteConfirmationModalComponent } from '../../modals/delete-confirmation-modal/delete-confirmation-modal.component';
import { AdminBlogDetailsModalComponent } from '../admin-blog-details-modal/admin-blog-details-modal.component';
import { ImgModalComponent } from '../../modals/img-modal/img-modal.component';
/*--------------------------------------------------------------------*/
@Component({
  selector: 'app-admin-blogs',
  templateUrl: './admin-blogs.component.html',
  styleUrl: './admin-blogs.component.css',
})
/*--------------------------------------------------------------------*/
export class AdminBlogsComponent {
  // Component properties
  blogsLoading: boolean = false;
  blogIdToDelete: number;
  blogs: (Blog & { deleting?: boolean })[] = [];
  currentPage: number = 1;
  totalPages: number;
  pageSize: number;
  totalCount: number;
  maxPagesToShow: number = 3;
  startEntry: number;
  endEntry: number;
  apiError: string | null = null;
  noBlogs: boolean = false;
  searchInput: string = '';
  searchInputChanged: Subject<string> = new Subject<string>();
  /*-----------------------------------------------------------------*/
  // Ctor
  constructor(private _BlogService: BlogService, private _Router: Router, private _ModalService: NgbModal, private _ToastrService: ToastrService) {
    this.searchInputChanged.pipe(debounceTime(300), distinctUntilChanged()).subscribe((searchTerm) => {
      this.searchBlogs(searchTerm);
    });
  }
  /*-----------------------------------------------------------------*/
  // Ng OnInit
  ngOnInit(): void {
    this.blogsLoading = true;
    this.fetchBlogs(this.currentPage);
  }
  /*-----------------------------------------------------------------*/
  // Fetch Blogs
  fetchBlogs(page: number, blogTitle?: string): void {
    this.blogsLoading = true;
    this.apiError = null;
    this._BlogService.getAllBlogsWithPagination(page, this.pageSize, blogTitle).subscribe({
      next: (response: PagedResponse<Blog>) => {
        this.blogs = response.items.map((blog: Blog) => ({ ...blog, deleting: false }));
        this.currentPage = response.currentPage;
        this.totalPages = response.totalPages;
        this.pageSize = response.pageSize;
        this.totalCount = response.totalCount;
        this.updateEntryRange();
        this.blogsLoading = false;
        this.noBlogs = this.blogs.length === 0;
      },
      error: (err) => {
        this.apiError = 'Failed to load Blogs, Please try again.';
        this._ToastrService.error('Failed to load Blogs, Please try again.');
        this.blogsLoading = false;
      },
    });
  }
  /*-----------------------------------------------------------------*/
  // Change Page
  changePage(page: number): void {
    this.blogsLoading = true;
    if (page >= 1 && page <= this.totalPages) {
      this.fetchBlogs(page);
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
  openDeleteConfirmationModal(blogId: number): void {
    const modalRef = this._ModalService.open(DeleteConfirmationModalComponent);
    this.blogIdToDelete = blogId;
    modalRef.componentInstance.message = `Are you sure you want to delete this Blog?`;
    modalRef.componentInstance.confirmDelete.subscribe(() => {
      this.deleteBlog(blogId);
    });
  }
  /*-----------------------------------------------------------------*/
  // Open Blog Details Modal
  openBlogDetailsModal(blog: Blog): void {
    const modalRef = this._ModalService.open(AdminBlogDetailsModalComponent, { size: 'lg' });
    modalRef.componentInstance.blog = blog;
  }
  /*-----------------------------------------------------------------*/
  // Open Img Modal
  openImgModal(blog: Blog): void {
    const modalRef = this._ModalService.open(ImgModalComponent, { size: 'lg' });
    modalRef.componentInstance.model = blog;
  }
  /*-----------------------------------------------------------------*/
  // Delete Blog
  deleteBlog(blogId: number): void {
    const blog = this.blogs.find((brand) => brand.id === blogId);
    if (blog) {
      blog.deleting = true;
      this._BlogService.deleteBlog(blogId).subscribe({
        next: () => {
          this.blogs = this.blogs.filter((brand) => brand.id !== blogId);
          this.totalCount--;

          if (this.blogs.length === 0 && this.currentPage > 1) {
            this.currentPage--;
          }
          this.updateEntryRange();
          this.fetchBlogs(this.currentPage);
          this._ToastrService.success('Blog deleted successfully');
        },
        error: (err) => {
          this._ToastrService.error('Failed to delete Blog, Please try again.');
          blog.deleting = false;
        },
      });
    }
  }
  /*-----------------------------------------------------------------*/
  // Search blogs
  onSearchInputChanged(searchTerm: string): void {
    this.searchInputChanged.next(searchTerm);
  }
  /*-----------------------------------------------------------------*/
  // Search
  searchBlogs(searchTerm: string = this.searchInput.trim()): void {
    this.currentPage = 1;
    this.fetchBlogs(this.currentPage, searchTerm);
  }
  /*-----------------------------------------------------------------*/
  // Edit Brand
  editBlog(blogId: number) {
    this._Router.navigate([`/admindashboard/editblog/${blogId}`]);
  }
  /*-----------------------------------------------------------------*/
}
