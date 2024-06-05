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
  categoriesItem: Category[] = [];
  loading: boolean = false;
  /*-----------------------------------------------------------------*/
  // Ctor
  constructor(private _CategoryService: CategoryService) {}
  /*-----------------------------------------------------------------*/
  ngOnInit(): void {
    this.loading = true;
    this._CategoryService.getAllCategories().subscribe({
      next: (response: any) => {
        this.categoriesItem = response.categories;
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
      },
    });
  }
  /*--------------------------------------------------------------------*/
}
