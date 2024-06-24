import { Component, OnInit } from '@angular/core';
import { ColorService } from '../../../services/color.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SaveConfirmationModalComponent } from '../../modals/save-confirmation-modal/save-confirmation-modal.component';
import { Color } from '../../../models/color';
/*--------------------------------------------------------------------*/
@Component({
  selector: 'app-admin-color-form',
  templateUrl: './admin-color-form.component.html',
  styleUrl: './admin-color-form.component.css',
})
/*--------------------------------------------------------------------*/
export class AdminColorFormComponent implements OnInit {
  // Component properties
  isLoading: boolean = false;
  colorLoading: boolean = false;
  editMode: boolean = false;
  currentColorId: number;
  apiError: string | null = null;
  /*------------------------------------------------------------------*/
  // Ctor
  constructor(
    private _ColorService: ColorService,
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
  // Color Form
  colorForm = new FormGroup({
    name: new FormControl<string>('', [Validators.required, Validators.minLength(3), Validators.maxLength(12), Validators.pattern('^[a-zA-Z ]*$')]),
  });
  /*------------------------------------------------------------------*/
  // Create Color Button (Edit or Add Brand)
  openSaveConfirmationModal(event: Event) {
    event.preventDefault();
    if (this.colorForm.invalid) {
      return;
    }
    const modalRef = this._ModalService.open(SaveConfirmationModalComponent);
    modalRef.componentInstance.message = 'Are you sure you want to save changes?';
    modalRef.componentInstance.confirmSave.subscribe(() => {
      this.saveColor();
    });
  }
  /*------------------------------------------------------------------*/
  saveColor() {
    if (this.colorForm.invalid) {
      return;
    }
    const colorData: any = {
      name: this.colorForm.controls['name'].value,
    };
    if (this.editMode) {
      this.updateColor(this.currentColorId, colorData);
    } else {
      this.createColor(colorData);
    }
  }
  /*------------------------------------------------------------------*/
  // Create Color
  private createColor(color: Color) {
    this.isLoading = true;
    this._ColorService.createColor(color).subscribe({
      next: (response: any) => {
        this._ToastrService.success('Color created successfully');
        this.colorForm.reset();
        this.isLoading = false;
        this.navigateToColorsDashboard();
      },
      error: (error: any) => {
        if (error.status === 400) {
          this._ToastrService.error('Color with the same name already exists, Color name must be unique.');
          this.apiError = 'Color with the same name already exists, Color name must be unique.';
          this.isLoading = false;
        } else {
          this._ToastrService.error('An error occurred while creating Color, Please try again.');
          this.apiError = 'An error occurred while creating Color, Please try again.';
          this.isLoading = false;
        }
      },
    });
  }
  /*------------------------------------------------------------------*/
  // Update specific Color
  private updateColor(colorId: number, color: Color) {
    this.isLoading = true;
    this._ColorService.updateColor(colorId, color).subscribe({
      next: (response: any) => {
        this._ToastrService.success('Color updated successfully');
        this.colorForm.reset();
        this.isLoading = false;
        this.navigateToColorsDashboard();
      },
      error: (error) => {
        if (error.status === 400) {
          this._ToastrService.error('Color with the same name already exists, Color name must be unique.');
          this.apiError = 'Color with the same name already exists, Color name must be unique.';
          this.isLoading = false;
        } else {
          this._ToastrService.error('An error occurred while updating Color, Please try again.');
          this.apiError = 'An error occurred while updating Color, Please try again.';
          this.isLoading = false;
        }
      },
    });
  }
  /*------------------------------------------------------------------*/
  // Navigate To Colors Dashboard After Add or Edit
  navigateToColorsDashboard() {
    this._Router.navigate(['/admindashboard/colors']);
  }
  /*------------------------------------------------------------------*/
  // Check Edit Mode for Colors Dashboard (Edit or Add Brand)
  private checkEditMode() {
    this._Route.params.subscribe((params) => {
      if (params['id']) {
        this.editMode = true;
        this.currentColorId = +params['id'];
        this.getColorById(params['id']);
      }
    });
  }
  /*------------------------------------------------------------------*/
  // Get a Specific Color By Id
  private getColorById(id: number) {
    this.colorLoading = true;
    this._ColorService.getColorById(id).subscribe({
      next: (response: Color) => {
        this.loadColorData(response);
        this.colorLoading = false;
      },
      error: (error) => {
        this._ToastrService.error('Error fetching Color by Id, Please try again.');
        this.apiError = 'Error fetching Color by Id, Please try again.';
        this.colorLoading = false;
      },
    });
  }
  /*------------------------------------------------------------------*/
  // Load Data Into Form When Loading Edit Form
  private loadColorData(color: Color) {
    this.colorForm.controls['name'].setValue(color.name);
  }
  /*------------------------------------------------------------------*/
  // Reset All Form
  resetAll() {
    this.colorForm.reset();
    this.apiError = null;
    this.isLoading = false;
    this.editMode = false;
  }
  /*------------------------------------------------------------------*/
}
