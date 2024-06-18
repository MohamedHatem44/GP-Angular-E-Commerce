import { Component } from '@angular/core';

@Component({
  selector: 'app-loader-skeleton-v3',
  templateUrl: './loader-skeleton-v3.component.html',
  styleUrl: './loader-skeleton-v3.component.css',
})
export class LoaderSkeletonV3Component {
  placeholders: number[] = [1, 2, 3, 4, 5, 6];

  constructor() {}

  ngOnInit(): void {}
}
