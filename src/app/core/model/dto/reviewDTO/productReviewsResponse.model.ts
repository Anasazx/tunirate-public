import {Page} from '../../page.model';
import {ReviewResponse} from './reviewResponse.model';

export interface ProductReviewsResponse {
  myReview: ReviewResponse | null;
  reviews: Page<ReviewResponse>;
}
