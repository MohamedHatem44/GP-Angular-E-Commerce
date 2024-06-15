import { Component, OnInit } from '@angular/core';
import { Brand } from '../../../models/brand';
import { BrandService } from '../../../services/brand.service';
/*--------------------------------------------------------------------*/
@Component({
  selector: 'app-brands',
  templateUrl: './brands.component.html',
  styleUrl: './brands.component.css',
})
/*--------------------------------------------------------------------*/
export class BrandsComponent implements OnInit {
  brands: Brand[] = [];
  brandsLoading: boolean = false;
  /*-----------------------------------------------------------------*/
  // Ctor
  constructor(private _BrandsService: BrandService) {}
  ngOnInit(): void {
    this.brandsLoading = true;
    this.fetchBrands();
  }
  /*-----------------------------------------------------------------*/
  // Fetch Brands
  private fetchBrands(): void {
    this.brandsLoading = true;
    this._BrandsService.getAllBrandsWithProducts().subscribe({
      next: (response: any) => {
        this.brands = response.brands;
        this.brandsLoading = false;
      },
      error: (err) => {
        console.log(err);
        this.brandsLoading = false;
      },
    });
  }
  /*-----------------------------------------------------------------*/
}
