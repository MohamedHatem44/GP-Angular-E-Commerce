import { Component, OnInit } from '@angular/core';
import { Category } from '../../../models/category';
import { CategoryService } from '../../../services/category.service';
import { ImageService } from '../../../services/image.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { uploadImage } from '../../../models/uploadImage';
import { SaveConfirmationModalComponent } from '../../modals/save-confirmation-modal/save-confirmation-modal.component';
/*--------------------------------------------------------------------*/
@Component({
  selector: 'app-admin-category-form',
  templateUrl: './admin-category-form.component.html',
  styleUrl: './admin-category-form.component.css',
})
/*--------------------------------------------------------------------*/
export class AdminCategoryFormComponent implements OnInit {
  // Component properties
  isLoading: boolean = false;
  categoryLoading: boolean = false;
  imageError: string | null = null;
  editMode: boolean = false;
  currentCategoryId: number;
  responseImageUrl: string | null = null;
  controllerName: string = 'Categories';
  apiError: string | null = null;
  /*------------------------------------------------------------------*/
  // Ctor
  constructor(
    private _CategoryService: CategoryService,
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
  // Category Form
  categoryForm = new FormGroup({
    name: new FormControl<string>('', [Validators.required, Validators.minLength(3), Validators.maxLength(50), Validators.pattern('^[a-zA-Z ]*$')]),
    description: new FormControl<string>('', [Validators.required, Validators.minLength(20), Validators.maxLength(250)]),
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
        this.categoryForm.patchValue({ imageUrl: this.responseImageUrl });
        this.imageError = null;
      },
      error: (error) => {
        this._ToastrService.error(error.error);
        this.imageError = error.error;
      },
    });
  }
  /*------------------------------------------------------------------*/
  // Create Category Button (Edit or Add Brand)
  openSaveConfirmationModal(event: Event) {
    event.preventDefault();
    if (this.categoryForm.invalid) {
      return;
    }
    const modalRef = this._ModalService.open(SaveConfirmationModalComponent);
    modalRef.componentInstance.message = 'Are you sure you want to save changes?';

    modalRef.componentInstance.confirmSave.subscribe(() => {
      this.saveCategory();
    });
  }
  /*------------------------------------------------------------------*/
  saveCategory() {
    if (this.categoryForm.invalid) {
      return;
    }
    const categoryData: any = {
      name: this.categoryForm.controls['name'].value,
      description: this.categoryForm.controls['description'].value,
      imageUrl: this.categoryForm.controls['imageUrl'].value,
    };
    if (this.editMode) {
      this.updateCategory(this.currentCategoryId, categoryData);
    } else {
      this.createCategory(categoryData);
    }
  }
  /*------------------------------------------------------------------*/
  // Get specific Category by id
  private createCategory(category: Category) {
    this.isLoading = true;
    this._CategoryService.createCategory(category).subscribe({
      next: (response: any) => {
        this._ToastrService.success('Category created successfully');
        this.categoryForm.reset();
        this.responseImageUrl = null;
        this.isLoading = false;
        this.navigateToBrandsDashboard();
      },
      error: (error: any) => {
        this._ToastrService.error('An error occurred while creating Category, Please try again.');
        this.apiError = 'An error occurred while creating Category, Please try again.';
        this.isLoading = false;
      },
    });
  }
  /*------------------------------------------------------------------*/
  // Update specific Brand
  private updateCategory(categoryId: number, category: Category) {
    this.isLoading = true;
    this._CategoryService.updateCategory(categoryId, category).subscribe({
      next: (response: any) => {
        this._ToastrService.success('Category updated successfully');
        this.categoryForm.reset();
        this.responseImageUrl = null;
        this.isLoading = false;
        this.navigateToBrandsDashboard();
      },
      error: (error) => {
        this._ToastrService.error('An error occurred while updating Category, Please try again.');
        this.apiError = 'An error occurred while updating Category, Please try again.';
        this.isLoading = false;
      },
    });
  }
  /*------------------------------------------------------------------*/
  // Navigate To Categories Dashboard After Add or Edit
  navigateToBrandsDashboard() {
    this._Router.navigate(['/admindashboard/categories']);
  }
  /*------------------------------------------------------------------*/
  // Check Edit Mode for Categories Dashboard (Edit or Add Category)
  private checkEditMode() {
    this._Route.params.subscribe((params) => {
      if (params['id']) {
        this.editMode = true;
        this.currentCategoryId = +params['id'];
        this.getCategoryById(params['id']);
      }
    });
  }
  /*------------------------------------------------------------------*/
  // Get a Specific Category By Id Without Products
  private getCategoryById(id: number) {
    this.categoryLoading = true;
    this._CategoryService.getCategoryById(id).subscribe({
      next: (response: Category) => {
        this.loadCategoryData(response);
        this.categoryLoading = false;
      },
      error: (error) => {
        this._ToastrService.error('Error fetching Category by Id, Please try again');
        this.categoryLoading = false;
      },
    });
  }
  /*------------------------------------------------------------------*/
  // Load Data Into Form When Loading Edit Form
  private loadCategoryData(category: Category) {
    this.categoryForm.controls['name'].setValue(category.name);
    this.categoryForm.controls['description'].setValue(category.description);
    this.categoryForm.controls['imageUrl'].setValue(category.imageUrl);
    // Display the image
    this.responseImageUrl = category.imageUrl;
  }
  /*------------------------------------------------------------------*/
  // Reset All Form
  resetAll() {
    this.categoryForm.reset();
    this.responseImageUrl = null;
    this.apiError = null;
    this.imageError = null;
    this.isLoading = false;
    this.editMode = false;
  }
  /*------------------------------------------------------------------*/
}
