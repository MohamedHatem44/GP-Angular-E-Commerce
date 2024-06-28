import { Component, OnInit } from '@angular/core';
import { Blog } from '../../../models/blog';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';
import { BlogService } from '../../../services/blog.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PagedResponse } from '../../../models/pagedResponse';
import { Category } from '../../../models/category';
import { CategoryService } from '../../../services/category.service';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { BrandService } from '../../../services/brand.service';
import { Brand } from '../../../models/brand';
import { ImgModalComponent } from '../../modals/img-modal/img-modal.component';
/*--------------------------------------------------------------------*/
@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrl: './blog.component.css',
  animations: [
    trigger('expandCollapse', [
      state('collapsed', style({ height: '0px', overflow: 'hidden', opacity: 0 })),
      state('expanded', style({ height: '*', opacity: 1 })),
      transition('collapsed <=> expanded', animate('300ms ease-in-out')),
    ]),
  ],
})
/*--------------------------------------------------------------------*/
export class BlogComponent implements OnInit {
  // Component properties
  blogs: Blog[] = [];
  categories: Category[] = [];
  brands: Brand[] = [];

  blogsLoading: boolean = false;
  categoriesLoading: boolean = false;
  brandsLoading: boolean = false;

  showAllCategories: boolean = false;
  showAllBrands: boolean = false;

  placeholders: any[] = Array.from({ length: 3 });

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
  constructor(
    private _BlogService: BlogService,
    private _CategoryService: CategoryService,
    private _BrandService: BrandService,
    private _ModalService: NgbModal
  ) {
    this.searchInputChanged.pipe(debounceTime(300), distinctUntilChanged()).subscribe((searchTerm) => {
      this.searchBlogs(searchTerm);
    });
  }
  /*-----------------------------------------------------------------*/
  // Ng OnInit
  ngOnInit(): void {
    this.fetchBlogs(this.currentPage);
    this.loadCategories();
    this.loadBrands();
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
  openImgModal(blog: Blog): void {
    const modalRef = this._ModalService.open(ImgModalComponent, { size: 'lg' });
    modalRef.componentInstance.model = blog;
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
  toggleDescription(blog: any) {
    blog.expanded = !blog.expanded;
  }
  /*-----------------------------------------------------------------*/
  getButtonText(blog: any): string {
    return blog.expanded ? '<i class="fa-solid fa-arrow-left"></i> Show less' : 'Continue reading <i class="fa-solid fa-arrow-right"></i>';
  }
  /*-----------------------------------------------------------------*/
  toggleShowAllCategories(): void {
    this.showAllCategories = !this.showAllCategories;
  }
  /*-----------------------------------------------------------------*/
  toggleShowAllBrands(): void {
    this.showAllBrands = !this.showAllBrands;
  }
  /*-----------------------------------------------------------------*/
}
