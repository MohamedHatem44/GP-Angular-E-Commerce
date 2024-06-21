import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../../services/product.service';
import { CategoryService } from '../../../services/category.service';
import { ColorService } from '../../../services/color.service';
import { BrandService } from '../../../services/brand.service';
import { SizeService } from '../../../services/size.service';
import { ImageService } from '../../../services/image.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { uploadImage } from '../../../models/uploadImage';
import { Brand } from '../../../models/brand';
import { Category } from '../../../models/category';
import { Color } from '../../../models/color';
import { Size } from '../../../models/size';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SaveConfirmationModalComponent } from '../../modals/save-confirmation-modal/save-confirmation-modal.component';
import { Product } from '../../../models/product';
/*--------------------------------------------------------------------*/
@Component({
  selector: 'app-admin-product-form',
  templateUrl: './admin-product-form.component.html',
  styleUrl: './admin-product-form.component.css',
})
/*--------------------------------------------------------------------*/
export class AdminProductFormComponent implements OnInit {
  // Component properties
  categories: Category[] = [];
  brands: Brand[] = [];
  colors: Color[] = [];
  sizes: Size[] = [];
  isLoading: boolean = false;
  singleProductLoading: boolean = false;
  imageError: string | null = null;
  editMode: boolean = false;
  currentProductId: number;
  responseImageUrl: string | null = null;
  controllerName: string = 'Products';
  apiError: string | null = null;
  /*------------------------------------------------------------------*/
  // Ctor
  constructor(
    private _ProductService: ProductService,
    private _CategoryService: CategoryService,
    private _BrandService: BrandService,
    private _ColorService: ColorService,
    private _SizeService: SizeService,
    private _ImageService: ImageService,
    private _Router: Router,
    private _Route: ActivatedRoute,
    private _ModalService: NgbModal,
    private _ToastrService: ToastrService
  ) {}
  /*------------------------------------------------------------------*/
  ngOnInit(): void {
    this.loadCategories();
    this.loadBrands();
    this.loadColors();
    this.loadSizes();
    this.checkEditMode();
  }
  /*------------------------------------------------------------------*/
  // Product Form
  productForm = new FormGroup({
    title: new FormControl<string>('', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]),
    description: new FormControl<string>('', [Validators.required, Validators.minLength(20), Validators.maxLength(250)]),
    imageUrl: new FormControl<string | null>('', [Validators.required]),
    quantity: new FormControl<number>(0, [Validators.required, Validators.min(1)]),
    sold: new FormControl<number>(0),
    price: new FormControl<number>(0, [Validators.required, Validators.min(0)]),
    priceAfterDiscount: new FormControl(0, [Validators.min(0)]),
    colorIds: new FormControl<number[]>([], [Validators.required]),
    sizeIds: new FormControl<number[]>([], [Validators.required]),
    categoryId: new FormControl<number>(null, [Validators.required]),
    brandId: new FormControl<number>(null, [Validators.required]),
  });
  /*------------------------------------------------------------------*/
  loadCategories(): void {
    this._CategoryService.getAllCategories().subscribe({
      next: (response: any) => {
        this.categories = response.categories;
      },
      error: (err) => {
        console.error('Failed to load categories', err);
        this._ToastrService.error('Failed to load categories, please try again.');
      },
    });
  }
  /*------------------------------------------------------------------*/
  loadBrands(): void {
    this._BrandService.getAllBrands().subscribe({
      next: (response: any) => {
        this.brands = response.brands;
      },
      error: (err) => {
        console.error('Failed to load brands', err);
        this._ToastrService.error('Failed to load brands, please try again.');
      },
    });
  }
  /*------------------------------------------------------------------*/
  loadColors(): void {
    this._ColorService.getAllColors().subscribe({
      next: (response: any) => {
        this.colors = response.colors;
      },
      error: (err) => {
        console.error('Failed to load colors', err);
        this._ToastrService.error('Failed to load colors, please try again.');
      },
    });
  }
  /*------------------------------------------------------------------*/
  loadSizes(): void {
    this._SizeService.getAllSizes().subscribe({
      next: (response: any) => {
        this.sizes = response.sizes;
      },
      error: (err) => {
        console.error('Failed to load sizes', err);
        this._ToastrService.error('Failed to load sizes, please try again.');
      },
    });
  }
  /*------------------------------------------------------------------*/
  // Image Upload
  onImageUpload(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    this._ImageService.uploadImage(file, this.controllerName).subscribe({
      next: (response: uploadImage) => {
        this.responseImageUrl = response.url;
        this.productForm.patchValue({ imageUrl: this.responseImageUrl });
        this.imageError = null;
      },
      error: (error) => {
        this._ToastrService.error(error.error);
        this.imageError = error.error;
      },
    });
  }
  /*------------------------------------------------------------------*/
  // Create Product Button (Edit or Add Brand)
  openSaveConfirmationModal(event: Event) {
    event.preventDefault();
    if (this.productForm.invalid) {
      return;
    }
    const modalRef = this._ModalService.open(SaveConfirmationModalComponent);
    modalRef.componentInstance.message = 'Are you sure you want to save changes?';

    modalRef.componentInstance.confirmSave.subscribe(() => {
      this.saveProduct();
    });
  }
  /*------------------------------------------------------------------*/
  saveProduct() {
    if (this.productForm.invalid) {
      return;
    }
    const productData: any = {
      title: this.productForm.controls['title'].value,
      description: this.productForm.controls['description'].value,
      imageUrl: this.productForm.controls['imageUrl'].value,
      quantity: this.productForm.controls['quantity'].value,
      sold: this.productForm.controls['sold'].value,
      price: this.productForm.controls['price'].value,
      priceAfterDiscount: this.productForm.controls['priceAfterDiscount'].value,
      colorIds: this.productForm.controls['colorIds'].value,
      sizeIds: this.productForm.controls['sizeIds'].value,
      categoryId: this.productForm.controls['categoryId'].value,
      brandId: this.productForm.controls['brandId'].value,
    };
    if (this.editMode) {
      this.updateProduct(this.currentProductId, productData);
    } else {
      this.createProduct(productData);
    }
  }
  /*------------------------------------------------------------------*/
  // Get specific Brand by id
  private createProduct(product: any) {
    this.isLoading = true;
    this._ProductService.createProduct(product).subscribe({
      next: (response: any) => {
        this._ToastrService.success('Product created successfully');
        this.productForm.reset();
        this.responseImageUrl = null;
        this.isLoading = false;
        this.navigateToBrandsDashboard();
      },
      error: (error: any) => {
        this._ToastrService.error('An error occurred while creating Product, Please try again.');
        this.apiError = 'An error occurred while creating Product, Please try again.';
        this.isLoading = false;
      },
    });
  }
  /*------------------------------------------------------------------*/
  // Update specific Product
  private updateProduct(productId: number, product: Product) {
    this.isLoading = true;
    this._ProductService.updateProduct(productId, product).subscribe({
      next: (response: any) => {
        this._ToastrService.success('Product updated successfully');
        this.productForm.reset();
        this.responseImageUrl = null;
        this.isLoading = false;
        this.navigateToBrandsDashboard();
      },
      error: (error) => {
        this._ToastrService.error('An error occurred while updating Product, Please try again.');
        this.apiError = 'An error occurred while updating Product, Please try again.';
        this.isLoading = false;
      },
    });
  }
  /*------------------------------------------------------------------*/
  // Navigate To Products Dashboard After Add or Edit
  navigateToBrandsDashboard() {
    this._Router.navigate(['/admindashboard/products']);
  }
  /*------------------------------------------------------------------*/
  // Check Edit Mode for Products Dashboard (Edit or Add Product)
  private checkEditMode() {
    this._Route.params.subscribe((params) => {
      if (params['id']) {
        this.editMode = true;
        this.currentProductId = +params['id'];
        this.getProductById(params['id']);
      }
    });
  }
  /*------------------------------------------------------------------*/
  // Get a Specific Product By Id
  private getProductById(id: number) {
    this.singleProductLoading = true;
    this._ProductService.getSpecificProductWithDetails(id).subscribe({
      next: (response: Product) => {
        this.loadBrandData(response);
        this.singleProductLoading = false;
      },
      error: (error) => {
        this._ToastrService.error('Error fetching Product by Id, Please try again.');
        this.singleProductLoading = false;
      },
    });
  }
  /*------------------------------------------------------------------*/
  // Load Data Into Form When Loading Edit Form
  private loadBrandData(product: any) {
    this.productForm.controls['title'].setValue(product.title);
    this.productForm.controls['description'].setValue(product.description);
    this.productForm.controls['imageUrl'].setValue(product.imageUrl);
    this.productForm.controls['quantity'].setValue(product.quantity);
    this.productForm.controls['sold'].setValue(product.sold);
    this.productForm.controls['price'].setValue(product.price);
    this.productForm.controls['priceAfterDiscount'].setValue(product.priceAfterDiscount);
    this.productForm.controls['colorIds'].setValue(product.colors.map((color: Color) => color.id));
    this.productForm.controls['sizeIds'].setValue(product.sizes.map((size: Size) => size.id));
    this.productForm.controls['categoryId'].setValue(product.category.id);
    this.productForm.controls['brandId'].setValue(product.brand.id);
    // Display the image
    this.responseImageUrl = product.imageUrl;
  }
  /*------------------------------------------------------------------*/
  // Reset All Form
  resetAll() {
    this.productForm.reset();
    this.responseImageUrl = null;
    this.apiError = null;
    this.imageError = null;
    this.isLoading = false;
    this.editMode = false;
  }
  /*------------------------------------------------------------------*/
  // Handle color selection change
  onColorChange(event: Event) {
    const input = event.target as HTMLInputElement;
    const value = +input.value;
    const selectedColors = this.productForm.controls['colorIds'].value as number[];
    if (input.checked) {
      if (!selectedColors.includes(value)) {
        selectedColors.push(value);
      }
    } else {
      const index = selectedColors.indexOf(value);
      if (index !== -1) {
        selectedColors.splice(index, 1);
      }
    }
    this.productForm.controls['colorIds'].setValue(selectedColors);
  }
  /*------------------------------------------------------------------*/
  // Check if a color is selected
  colorSelected(colorId: number): boolean {
    return this.productForm.controls['colorIds'].value.includes(colorId);
  }
  /*------------------------------------------------------------------*/
  onSizeChange(event: Event) {
    const input = event.target as HTMLInputElement;
    const value = +input.value;
    const selectedSizes = this.productForm.controls['sizeIds'].value as number[];
    if (input.checked) {
      if (!selectedSizes.includes(value)) {
        selectedSizes.push(value);
      }
    } else {
      const index = selectedSizes.indexOf(value);
      if (index !== -1) {
        selectedSizes.splice(index, 1);
      }
    }
    this.productForm.controls['sizeIds'].setValue(selectedSizes);
  }
  /*------------------------------------------------------------------*/
  sizeSelected(sizeId: number): boolean {
    return this.productForm.controls['sizeIds'].value.includes(sizeId);
  }
  /*------------------------------------------------------------------*/
}
