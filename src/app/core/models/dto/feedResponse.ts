import {ProductResponse} from '../../../features/product/models/productDTO/productResponse.model';
import {MinimizedReviewResponse} from './reviewDTO/minimizedReviewResponse.model';
import {SubcategoryResponse} from './subcategoryDTO/subcategoryResponse.model';

export interface FeedResponse {
  categories: SubcategoryResponse[];
  products: ProductResponse[];
  reviews: MinimizedReviewResponse[];
}
