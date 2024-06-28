import { Component, OnInit } from '@angular/core';
import { Blog } from '../../../models/blog';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';
import { BlogService } from '../../../services/blog.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PagedResponse } from '../../../models/pagedResponse';
/*--------------------------------------------------------------------*/
@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrl: './blog.component.css',
})
/*--------------------------------------------------------------------*/
export class BlogComponent implements OnInit {
  // Component properties
  blogsLoading: boolean = false;
  blogs: Blog[] = [];
  currentPage: number = 1;
  totalPages: number;
  pageSize: number = 3;
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
  constructor(private _BlogService: BlogService, private _ModalService: NgbModal) {
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
        this.blogs = response.items;
        this.currentPage = response.currentPage;
        this.totalPages = response.totalPages;
        // this.pageSize = response.pageSize;
        this.totalCount = response.totalCount;
        this.updateEntryRange();
        this.blogsLoading = false;
        this.noBlogs = this.blogs.length === 0;
      },
      error: (err) => {
        this.apiError = 'Failed to load Blogs, Please try again.';
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
  // Open Blog Details Modal
  // openBlogDetailsModal(blog: Blog): void {
  //   const modalRef = this._ModalService.open(AdminBlogDetailsModalComponent, { size: 'lg' });
  //   modalRef.componentInstance.blog = blog;
  // }
  /*-----------------------------------------------------------------*/
  // Open Img Modal
  // openImgModal(blog: Blog): void {
  //   const modalRef = this._ModalService.open(ImgModalComponent, { size: 'lg' });
  //   modalRef.componentInstance.model = blog;
  // }
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
}
