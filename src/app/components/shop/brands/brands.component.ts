import { Component, OnInit } from '@angular/core';
import { BrandService } from '../../../services/brand.service';
import { Brand } from '../../../models/brand';
/*--------------------------------------------------------------------*/
@Component({
  selector: 'app-brands',
  templateUrl: './brands.component.html',
  styleUrl: './brands.component.css',
})
/*--------------------------------------------------------------------*/
export class BrandsComponent implements OnInit {
  brandsItems: Brand[] = [];
  loading: boolean = false;
  /*--------------------------------------------------------------------*/
  // Ctor
  constructor(private _BrandsService: BrandService) {}
  // launchModal() {
  //   $('#exampleModal').modal('show'); // You might need to import jQuery
  // }
  /*--------------------------------------------------------------------*/
  ngOnInit(): void {
    this.loading = true;
    this._BrandsService.getAllBrands().subscribe({
      next: (response: any) => {
        this.brandsItems = response.brands;
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
      },
    });
  }
  /*--------------------------------------------------------------------*/
}
