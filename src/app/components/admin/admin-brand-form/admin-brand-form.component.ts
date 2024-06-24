import { Component, OnInit } from '@angular/core';
import { ImageService } from '../../../services/image.service';
import { uploadImage } from '../../../models/uploadImage';
import { BrandService } from '../../../services/brand.service';
import { Brand } from '../../../models/brand';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SaveConfirmationModalComponent } from '../../modals/save-confirmation-modal/save-confirmation-modal.component';
/*--------------------------------------------------------------------*/
@Component({
  selector: 'app-admin-brand-form',
  templateUrl: './admin-brand-form.component.html',
  styleUrl: './admin-brand-form.component.css',
})
/*--------------------------------------------------------------------*/
export class AdminBrandFormComponent implements OnInit {
  // Component properties
  isLoading: boolean = false;
  brandLoading: boolean = false;
  imageError: string | null = null;
  editMode: boolean = false;
  currentBrandId: number;
  responseImageUrl: string | null = null;
  controllerName: string = 'Brands';
  apiError: string | null = null;
  /*------------------------------------------------------------------*/
  // Ctor
  constructor(
    private _BrandService: BrandService,
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
  // Brand Form
  brandForm = new FormGroup({
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
        this.brandForm.patchValue({ imageUrl: this.responseImageUrl });
        this.imageError = null;
      },
      error: (error) => {
        this._ToastrService.error(error.error);
        this.imageError = error.error;
      },
    });
  }
  /*------------------------------------------------------------------*/
  // Create Brand Button (Edit or Add Brand)
  openSaveConfirmationModal(event: Event) {
    event.preventDefault();
    if (this.brandForm.invalid) {
      return;
    }
    const modalRef = this._ModalService.open(SaveConfirmationModalComponent);
    modalRef.componentInstance.message = 'Are you sure you want to save changes?';

    modalRef.componentInstance.confirmSave.subscribe(() => {
      this.saveBrand();
    });
  }
  /*------------------------------------------------------------------*/
  saveBrand() {
    if (this.brandForm.invalid) {
      return;
    }
    const brandData: any = {
      name: this.brandForm.controls['name'].value,
      description: this.brandForm.controls['description'].value,
      imageUrl: this.brandForm.controls['imageUrl'].value,
    };
    if (this.editMode) {
      this.updateBrand(this.currentBrandId, brandData);
    } else {
      this.createBrand(brandData);
    }
  }
  /*------------------------------------------------------------------*/
  // Get specific Brand by id
  private createBrand(brand: Brand) {
    this.isLoading = true;
    this._BrandService.createBrand(brand).subscribe({
      next: (response: any) => {
        this._ToastrService.success('Brand created successfully');
        this.brandForm.reset();
        this.responseImageUrl = null;
        this.isLoading = false;
        this.navigateToBrandsDashboard();
      },
      error: (error: any) => {
        this._ToastrService.error('An error occurred while creating Brand, Please try again.');
        this.apiError = 'An error occurred while creating Brand, Please try again.';
        this.isLoading = false;
      },
    });
  }
  /*------------------------------------------------------------------*/
  // Update specific Brand
  private updateBrand(brandId: number, brand: Brand) {
    this.isLoading = true;
    this._BrandService.updateBrand(brandId, brand).subscribe({
      next: (response: any) => {
        this._ToastrService.success('Brand updated successfully');
        this.brandForm.reset();
        this.responseImageUrl = null;
        this.isLoading = false;
        this.navigateToBrandsDashboard();
      },
      error: (error) => {
        this._ToastrService.error('An error occurred while updating Brand, Please try again.');
        this.apiError = 'An error occurred while updating Brand, Please try again.';
        this.isLoading = false;
      },
    });
  }
  /*------------------------------------------------------------------*/
  // Navigate To Brands Dashboard After Add or Edit
  navigateToBrandsDashboard() {
    this._Router.navigate(['/admindashboard/brands']);
  }
  /*------------------------------------------------------------------*/
  // Check Edit Mode for Brands Dashboard (Edit or Add Brand)
  private checkEditMode() {
    this._Route.params.subscribe((params) => {
      if (params['id']) {
        this.editMode = true;
        this.currentBrandId = +params['id'];
        this.getBrandById(params['id']);
      }
    });
  }
  /*------------------------------------------------------------------*/
  // Get a Specific Brand By Id Without Products
  private getBrandById(id: number) {
    this.brandLoading = true;
    this._BrandService.getBrandById(id).subscribe({
      next: (response: Brand) => {
        this.loadBrandData(response);
        this.brandLoading = false;
      },
      error: (error) => {
        this._ToastrService.error('Error fetching Brand by Id, Please try again.');
        this.brandLoading = false;
      },
    });
  }
  /*------------------------------------------------------------------*/
  // Load Data Into Form When Loading Edit Form
  private loadBrandData(brand: Brand) {
    this.brandForm.controls['name'].setValue(brand.name);
    this.brandForm.controls['description'].setValue(brand.description);
    this.brandForm.controls['imageUrl'].setValue(brand.imageUrl);
    // Display the image
    this.responseImageUrl = brand.imageUrl;
  }
  /*------------------------------------------------------------------*/
  // Reset All Form
  resetAll() {
    this.brandForm.reset();
    this.responseImageUrl = null;
    this.apiError = null;
    this.imageError = null;
    this.isLoading = false;
    this.editMode = false;
  }
  /*------------------------------------------------------------------*/
}
