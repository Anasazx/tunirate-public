import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import {MinimizedReviewResponse} from '../../../../core/model/dto/reviewDTO/minimizedReviewResponse.model';
import {ReviewService} from '../../../../core/services/reviewService/review.service';
import {RouterLink} from '@angular/router';


@Component({
  selector: 'app-my-reviews',
  standalone: true,
  imports: [CommonModule, DatePipe, RouterLink],
  templateUrl: './my-reviews.component.html',
  styleUrl: './my-reviews.component.css'
})
export class MyReviewsComponent implements OnInit {

  reviews: MinimizedReviewResponse[] = [];
  loading = true;

  constructor(private reviewService: ReviewService) {}

  ngOnInit(): void {
    this.loadReviews();
  }

  loadReviews() {
    this.reviewService.getMyReviews().subscribe({
      next: (res) => {
        this.reviews = res;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading reviews:', err);
        this.loading = false;
      }
    });
  }

}
