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
  loading: boolean = false;
  categories: Category[] = [];
  groupedCategories: Category[][] = [];
  /*-----------------------------------------------------------------*/
  // Ctor
  constructor(private _CategoryService: CategoryService) {}
  /*-----------------------------------------------------------------*/
  ngOnInit(): void {
    // this.loading = true;
    this.fetchCategories();
  }
  /*-----------------------------------------------------------------*/
  // Fetch Categories
  private fetchCategories(): void {
    this._CategoryService.getAllCategoriesWithProducts().subscribe({
      next: (response: any) => {
        console.log(response);
        this.categories = response.categories;
        this.groupCategories();
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
  /*-----------------------------------------------------------------*/
  private groupCategories(): void {
    for (let i = 0; i < this.categories.length; i += 4) {
      this.groupedCategories.push(this.categories.slice(i, i + 4));
    }
  }
}
