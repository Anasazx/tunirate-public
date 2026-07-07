import {Component, EventEmitter, Input, OnChanges, Output} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {NgForOf, NgIf, NgSwitch, NgSwitchCase} from '@angular/common';
import {ReviewResponse} from '../../../../../../core/model/dto/reviewDTO/reviewResponse.model';
import {ReviewRequest} from '../../../../../../core/model/dto/reviewDTO/reviewRequest.model';

@Component({
  selector: 'app-review-form',
  imports: [
    FormsModule,
    NgForOf,
    NgIf,
    NgSwitchCase,
    NgSwitch
  ],
  templateUrl: './review-form.component.html',
  styleUrl: './review-form.component.css'
})
export class ReviewFormComponent implements OnChanges{

  @Input() productId?: number;
  @Input() myReview: ReviewResponse | null = null;
  @Input() submittingReview = false;

  @Output() reviewSubmitted = new EventEmitter<ReviewRequest>();

  reviewContent = '';
  selectedRating = 0;
  hoveredRating = 0;

  editing = false;

  private originalContent = '';

  private originalRating = 0;

  constructor() {}

  ngOnChanges() {
    if (this.myReview) {
      this.reviewContent = this.myReview.content ?? '';
      this.selectedRating = this.myReview.rating ?? 0;
      this.originalContent = this.reviewContent;
      this.originalRating = this.selectedRating;
      this.editing = false;
    } else {
      this.reviewContent = '';
      this.selectedRating = 0;
      this.editing = true;
    }
  }

  submit() {
    if (!this.productId || this.selectedRating === 0) {
      return;
    }
    const request: ReviewRequest = {
      productId: this.productId,
      rating: this.selectedRating,
      content: this.reviewContent || null
    };
    this.reviewSubmitted.emit(request);
  }

  get reviewFormTitle() {
    return this.myReview ? 'Update Your Review' : 'Share Your Thoughts';
  }

  get reviewFormButtonLabel() {
    return this.myReview ? 'Update Review' : 'Submit Review';
  }

  startEdit() {
    this.editing = true;
  }

  cancelEdit() {
    this.reviewContent = this.originalContent;
    this.selectedRating = this.originalRating;
    this.editing = false;
  }

  get hasChanges(): boolean {
    return this.reviewContent !== this.originalContent || this.selectedRating !== this.originalRating;
  }

}
