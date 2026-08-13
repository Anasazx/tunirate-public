import { Component, Input } from '@angular/core';
import { NgForOf, NgIf } from '@angular/common';

@Component({
  selector: 'app-product-rating-overview',
  standalone: true,
  imports: [
    NgForOf,
    NgIf
  ],
  templateUrl: './product-rating-overview.component.html',
  styleUrl: './product-rating-overview.component.css'
})
export class ProductRatingOverviewComponent {

  @Input() averageRating = 0;
  @Input() reviewsCount = 0;
  @Input() ratingDistribution: Record<number, number> = {};

  getStarState(star: number): 'full' | 'half' | 'empty' {
    if (this.averageRating >= star) {
      return 'full';
    }

    if (this.averageRating >= star - 0.5) {
      return 'half';
    }

    return 'empty';
  }

  getStarPercent(star: number): number {
    if (this.reviewsCount === 0) {
      return 0;
    }

    const count = this.ratingDistribution[star] ?? 0;

    return (count / this.reviewsCount) * 100;
  }
}
