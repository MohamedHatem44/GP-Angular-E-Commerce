import { Component, OnInit } from '@angular/core';
import { Category } from '../../../models/category';
import { CategoryService } from '../../../services/category.service';
import { ProductService } from '../../../services/product.service';
import { BrandService } from '../../../services/brand.service';
import { Brand } from '../../../models/brand';
/*--------------------------------------------------------------------*/
@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrl: './products.component.css',
})
/*--------------------------------------------------------------------*/
export class ProductsComponent implements OnInit {
  products: any[] = [];
  categories: Category[] = [];
  brands: Brand[] = [];
  productsIsSpin: boolean = false;
  /*--------------------------------------------------------------------*/
  constructor(private _ProductService: ProductService, private _CategoryService: CategoryService, private _BrandService: BrandService) {}
  /*--------------------------------------------------------------------*/
  ngOnInit(): void {
    this.productsIsSpin = true;
    this.fetchProducts();
    this.fetchCategories();
    this.fetchBrands();
  }
  /*--------------------------------------------------------------------*/
  // Fetch Categories
  private fetchProducts(): void {
    this._ProductService.getAllProducts().subscribe({
      next: (response: any) => {
        console.log(response);
        this.products = response.products;
        this.productsIsSpin = false;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
  /*--------------------------------------------------------------------*/
  // Fetch Categories
  private fetchCategories(): void {
    this._CategoryService.getAllCategoriesWithProducts().subscribe({
      next: (response: any) => {
        console.log(response);
        this.categories = response.categories;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
  /*--------------------------------------------------------------------*/
  // Fetch Brands
  private fetchBrands(): void {
    this._BrandService.getAllBrandsWithProducts().subscribe({
      next: (response: any) => {
        console.log(response);
        this.brands = response.brands;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
  /*--------------------------------------------------------------------*/
}
