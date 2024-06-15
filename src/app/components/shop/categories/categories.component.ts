import { Component, OnInit } from '@angular/core';
import { Category } from '../../../models/category';
import { CategoryService } from '../../../services/category.service';
/*--------------------------------------------------------------------*/
@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.css',
})
/*--------------------------------------------------------------------*/
export class CategoriesComponent implements OnInit {
  categories: Category[] = [];
  categoriesLoading: boolean = false;
  /*-----------------------------------------------------------------*/
  // Ctor
  constructor(private _CategoryService: CategoryService) {}
  /*-----------------------------------------------------------------*/
  ngOnInit(): void {
    this.categoriesLoading = true;
    this.fetchCategories();
  }
  /*-----------------------------------------------------------------*/
  // Fetch Categories
  private fetchCategories(): void {
    this.categoriesLoading = true;
    this._CategoryService.getAllCategoriesWithProducts().subscribe({
      next: (response: any) => {
        this.categories = response.categories;
        this.categoriesLoading = false;
      },
      error: (err) => {
        console.log(err);
        this.categoriesLoading = false;
      },
    });
  }
  /*-----------------------------------------------------------------*/
}
