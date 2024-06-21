import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../../services/product.service';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Product } from '../../../models/product';
/*--------------------------------------------------------------------*/
@Component({
  selector: 'app-admin-product-details',
  templateUrl: './admin-product-details.component.html',
  styleUrl: './admin-product-details.component.css',
})
/*--------------------------------------------------------------------*/
export class AdminProductDetailsComponent implements OnInit {
  // Component properties
  isLoading: boolean = false;
  product: Product;
  selectedTab: string = 'description';
  /*------------------------------------------------------------------*/
  // Ctor
  constructor(
    private _ProductService: ProductService,
    private _Route: ActivatedRoute,
    private _ModalService: NgbModal,
    private _ToastrService: ToastrService
  ) {}
  /*------------------------------------------------------------------*/
  ngOnInit(): void {
    const productId = +this._Route.snapshot.paramMap.get('id');
    this.loadProductDetails(productId);
  }

  /*------------------------------------------------------------------*/
  // Get a Specific Product By Id
  private loadProductDetails(productId: number): void {
    this.isLoading = true;
    this._ProductService.getSpecificProductWithDetails(productId).subscribe({
      next: (response: Product) => {
        this.product = response;
        this.isLoading = false;
      },
      error: (error) => {
        this._ToastrService.error('Error fetching Product by Id, Please try again.');
        this.isLoading = false;
      },
    });
  }
  /*------------------------------------------------------------------*/
  selectTab(tab: string) {
    this.selectedTab = tab;
  }
  /*------------------------------------------------------------------*/
}
