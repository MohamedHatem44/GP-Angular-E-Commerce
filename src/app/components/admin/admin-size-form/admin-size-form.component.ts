import { Component } from '@angular/core';
import { SizeService } from '../../../services/size.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SaveConfirmationModalComponent } from '../../modals/save-confirmation-modal/save-confirmation-modal.component';
import { Size } from '../../../models/size';
/*--------------------------------------------------------------------*/
@Component({
  selector: 'app-admin-size-form',
  templateUrl: './admin-size-form.component.html',
  styleUrl: './admin-size-form.component.css',
})
/*--------------------------------------------------------------------*/
export class AdminSizeFormComponent {
  // Component properties
  isLoading: boolean = false;
  sizeLoading: boolean = false;
  editMode: boolean = false;
  currentSizeId: number;
  apiError: string | null = null;
  /*------------------------------------------------------------------*/
  // Ctor
  constructor(
    private _SizeService: SizeService,
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
  // Size Form
  sizeForm = new FormGroup({
    name: new FormControl<string>('', [Validators.required, Validators.minLength(1), Validators.maxLength(12)]),
  });
  /*------------------------------------------------------------------*/
  // Create Size Button (Edit or Add Brand)
  openSaveConfirmationModal(event: Event) {
    event.preventDefault();
    if (this.sizeForm.invalid) {
      return;
    }
    const modalRef = this._ModalService.open(SaveConfirmationModalComponent);
    modalRef.componentInstance.message = 'Are you sure you want to save changes?';
    modalRef.componentInstance.confirmSave.subscribe(() => {
      this.saveSize();
    });
  }
  /*------------------------------------------------------------------*/
  saveSize() {
    if (this.sizeForm.invalid) {
      return;
    }
    const sizeData: any = {
      name: this.sizeForm.controls['name'].value,
    };
    if (this.editMode) {
      this.updateSize(this.currentSizeId, sizeData);
    } else {
      this.createSize(sizeData);
    }
  }
  /*------------------------------------------------------------------*/
  // Create Size
  private createSize(size: Size) {
    this.isLoading = true;
    this._SizeService.createSize(size).subscribe({
      next: (response: any) => {
        this._ToastrService.success('Size created successfully');
        this.sizeForm.reset();
        this.isLoading = false;
        this.navigateToColorsDashboard();
      },
      error: (error: any) => {
        if (error.status === 400) {
          this._ToastrService.error('Size with the same name already exists, Size name must be unique.');
          this.apiError = 'Size with the same name already exists, Size name must be unique.';
          this.isLoading = false;
        } else {
          this._ToastrService.error('An error occurred while creating Size, Please try again.');
          this.apiError = 'An error occurred while creating Size, Please try again.';
          this.isLoading = false;
        }
      },
    });
  }
  /*------------------------------------------------------------------*/
  // Update specific Size
  private updateSize(sizeId: number, size: Size) {
    this.isLoading = true;
    this._SizeService.updateSize(sizeId, size).subscribe({
      next: (response: any) => {
        this._ToastrService.success('Size updated successfully');
        this.sizeForm.reset();
        this.isLoading = false;
        this.navigateToColorsDashboard();
      },
      error: (error) => {
        if (error.status === 400) {
          this._ToastrService.error('Size with the same name already exists, Size name must be unique.');
          this.apiError = 'Size with the same name already exists, Size name must be unique.';
          this.isLoading = false;
        } else {
          this._ToastrService.error('An error occurred while updating Size, Please try again.');
          this.apiError = 'An error occurred while updating Size, Please try again.';
          this.isLoading = false;
        }
      },
    });
  }
  /*------------------------------------------------------------------*/
  // Navigate To Sizes Dashboard After Add or Edit
  navigateToColorsDashboard() {
    this._Router.navigate(['/admindashboard/sizes']);
  }
  /*------------------------------------------------------------------*/
  // Check Edit Mode for Sizes Dashboard (Edit or Add Brand)
  private checkEditMode() {
    this._Route.params.subscribe((params) => {
      if (params['id']) {
        this.editMode = true;
        this.currentSizeId = +params['id'];
        this.getSizeById(params['id']);
      }
    });
  }
  /*------------------------------------------------------------------*/
  // Get a Specific Size By Id
  private getSizeById(id: number) {
    this.sizeLoading = true;
    this._SizeService.getSizeById(id).subscribe({
      next: (response: Size) => {
        this.loadSizeData(response);
        this.sizeLoading = false;
      },
      error: (error) => {
        this._ToastrService.error('An Error Occurred while Loading Size, Please try again.');
        this.apiError = 'An Error Occurred while Loading Size, Please try again.';
        this.sizeLoading = false;
      },
    });
  }
  /*------------------------------------------------------------------*/
  // Load Data Into Form When Loading Edit Form
  private loadSizeData(size: Size) {
    this.sizeForm.controls['name'].setValue(size.name);
  }
  /*------------------------------------------------------------------*/
  // Reset All Form
  resetAll() {
    this.sizeForm.reset();
    this.apiError = null;
    this.isLoading = false;
    this.editMode = false;
  }
  /*------------------------------------------------------------------*/
}
