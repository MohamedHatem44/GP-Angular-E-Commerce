import { Component, HostListener } from '@angular/core';
import { Category } from '../../../models/category';
import { CategoryService } from '../../../services/category.service';
import { Product } from '../../../models/product';
/*--------------------------------------------------------------------*/
@Component({
  selector: 'app-categories-slider',
  templateUrl: './categories-slider.component.html',
  styleUrl: './categories-slider.component.css',
})
/*--------------------------------------------------------------------*/
export class CategoriesSliderComponent {
  allCategories: Category[] = [];
  categoriesInSlides: any[] = [];
  iterationIncrement: number = 3;
  isLoading: boolean = false;
  error: string = '';

  constructor(private _CategoryService: CategoryService) {}

  ngOnInit(): void {
    this.onResize(null);
    this.getAllCategories();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.iterationIncrement = window.innerWidth < 500 ? 1 : 3;
    this.processCategoriesForSlider();
  }

  async getAllCategories(): Promise<void> {
    try {
      this.isLoading = true;
      const resppp: any = await this._CategoryService.getAllCategories().toPromise();
      const res = resppp.categories;
      this.allCategories = Array.isArray(res) ? res : [res];
      this.processCategoriesForSlider();
      this.isLoading = false;
    } catch (err: any) {
      console.error(err);
      this.isLoading = false;
      this.error = err.error.message;
    }
  }

  processCategoriesForSlider(): void {
    this.categoriesInSlides = [];
    for (let i = 0; i < this.allCategories.length; i += this.iterationIncrement) {
      const slice = this.allCategories.slice(i, i + this.iterationIncrement);
      this.categoriesInSlides.push(slice);
    }
  }

  getImageUrl(imagePath: string): string {
    return `path_to_images/${imagePath}`;
  }
}
