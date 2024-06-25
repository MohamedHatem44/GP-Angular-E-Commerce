import { Component, OnInit } from '@angular/core';
import { BlogService } from '../../../services/blog.service';
import { ImageService } from '../../../services/image.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { uploadImage } from '../../../models/uploadImage';
import { SaveConfirmationModalComponent } from '../../modals/save-confirmation-modal/save-confirmation-modal.component';
import { Blog } from '../../../models/blog';
/*------------------------------------------------------------------*/
@Component({
  selector: 'app-admin-blog-form',
  templateUrl: './admin-blog-form.component.html',
  styleUrl: './admin-blog-form.component.css',
})
/*------------------------------------------------------------------*/
export class AdminBlogFormComponent implements OnInit {
  // Component properties
  isLoading: boolean = false;
  imageError: string | null = null;
  editMode: boolean = false;
  currentBlogId: number;
  responseImageUrl: string | null = null;
  controllerName: string = 'Blogs';
  apiError: string | null = null;
  blogLoading: boolean = false;
  /*------------------------------------------------------------------*/
  // Ctor
  constructor(
    private _BlogService: BlogService,
    private _ImageService: ImageService,
    private _Router: Router,
    private _Route: ActivatedRoute,
    private _ModalService: NgbModal,
    private _ToastrService: ToastrService
  ) {}
  /*------------------------------------------------------------------*/
  ngOnInit(): void {
    this.checkEditMode();
  }
  /*------------------------------------------------------------------*/
  // Blog Form
  blogForm = new FormGroup({
    title: new FormControl<string>('', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]),
    description: new FormControl<string>('', [Validators.required, Validators.minLength(20), Validators.maxLength(1000)]),
    imageUrl: new FormControl<string | null>('', [Validators.required]),
  });
  /*------------------------------------------------------------------*/
  // Image Upload
  onImageUpload(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    this._ImageService.uploadImage(file, this.controllerName).subscribe({
      next: (response: uploadImage) => {
        this.responseImageUrl = response.url;
        this.blogForm.patchValue({ imageUrl: this.responseImageUrl });
        this.imageError = null;
      },
      error: (error) => {
        this._ToastrService.error(error.error);
        this.imageError = error.error;
      },
    });
  }
  /*------------------------------------------------------------------*/
  // Create Blog Button (Edit or Add Blog)
  openSaveConfirmationModal(event: Event) {
    event.preventDefault();
    if (this.blogForm.invalid) {
      return;
    }
    const modalRef = this._ModalService.open(SaveConfirmationModalComponent);
    modalRef.componentInstance.message = 'Are you sure you want to save changes?';

    modalRef.componentInstance.confirmSave.subscribe(() => {
      this.saveBlog();
    });
  }
  /*------------------------------------------------------------------*/
  saveBlog() {
    if (this.blogForm.invalid) {
      return;
    }
    const blogData: Blog = {
      title: this.blogForm.controls['title'].value,
      description: this.blogForm.controls['description'].value,
      imageUrl: this.blogForm.controls['imageUrl'].value,
    };
    if (this.editMode) {
      this.updateBlog(this.currentBlogId, blogData);
    } else {
      this.createBlog(blogData);
    }
  }
  /*------------------------------------------------------------------*/
  // Get specific Brand by id
  private createBlog(blog: Blog) {
    this.isLoading = true;
    this._BlogService.createBlog(blog).subscribe({
      next: (response: any) => {
        this._ToastrService.success('Blog created successfully');
        this.blogForm.reset();
        this.responseImageUrl = null;
        this.isLoading = false;
        this.navigateToBlogsDashboard();
      },
      error: (error: any) => {
        console.log(error);
        this._ToastrService.error('An error occurred while creating Blog, Please try again.');
        this.apiError = 'An error occurred while creating Blog, Please try again.';
        this.isLoading = false;
      },
    });
  }
  /*------------------------------------------------------------------*/
  // Update specific Blog
  private updateBlog(blogId: number, blog: Blog) {
    this.isLoading = true;
    this._BlogService.updateBlog(blogId, blog).subscribe({
      next: (response: any) => {
        this._ToastrService.success('Blog updated successfully');
        this.blogForm.reset();
        this.responseImageUrl = null;
        this.isLoading = false;
        this.navigateToBlogsDashboard();
      },
      error: (error) => {
        this._ToastrService.error('An error occurred while updating Blog, Please try again.');
        this.apiError = 'An error occurred while updating Blog, Please try again.';
        this.isLoading = false;
      },
    });
  }
  /*------------------------------------------------------------------*/
  // Navigate To Blogs Dashboard After Add or Edit
  navigateToBlogsDashboard() {
    this._Router.navigate(['/admindashboard/blogs']);
  }
  /*------------------------------------------------------------------*/
  // Check Edit Mode for Blogs Dashboard (Edit or Add Blog)
  private checkEditMode() {
    this._Route.params.subscribe((params) => {
      if (params['id']) {
        this.editMode = true;
        this.currentBlogId = +params['id'];
        this.getBlogById(params['id']);
      }
    });
  }
  /*------------------------------------------------------------------*/
  // Get a Specific Blog By Id
  private getBlogById(blogId: number) {
    this.blogLoading = true;
    this._BlogService.getBlogByIdWithUser(blogId).subscribe({
      next: (response: Blog) => {
        this.blogLoading = false;
        this.loadBlogData(response);
      },
      error: (error) => {
        this._ToastrService.error('Error fetching Blog by Id, Please try again.');
        this.blogLoading = false;
      },
    });
  }
  /*------------------------------------------------------------------*/
  // Load Data Into Form When Loading Edit Form
  private loadBlogData(blog: Blog) {
    this.blogForm.controls['title'].setValue(blog.title);
    this.blogForm.controls['description'].setValue(blog.description);
    this.blogForm.controls['imageUrl'].setValue(blog.imageUrl);
    // Display the image
    this.responseImageUrl = blog.imageUrl;
  }
  /*------------------------------------------------------------------*/
  // Reset All Form
  resetAll() {
    this.blogForm.reset();
    this.responseImageUrl = null;
    this.apiError = null;
    this.imageError = null;
    this.isLoading = false;
    this.blogLoading = false;
    this.editMode = false;
  }
  /*------------------------------------------------------------------*/
}
