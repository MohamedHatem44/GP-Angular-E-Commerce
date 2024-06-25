import { Component } from '@angular/core';

@Component({
  selector: 'app-loader-skeleton-v4',
  templateUrl: './loader-skeleton-v4.component.html',
  styleUrl: './loader-skeleton-v4.component.css',
})
export class LoaderSkeletonV4Component {
  placeholders: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  constructor() {}

  ngOnInit(): void {}
}
