import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SharedService } from '../sharedService/shared.service';
import { ReviewResponse } from '../../model/dto/reviewDTO/reviewResponse.model';
import { ReviewRequest } from '../../model/dto/reviewDTO/reviewRequest.model';
import {MinimizedReviewResponse} from '../../model/dto/reviewDTO/minimizedReviewResponse.model';
import {ProductReviewsResponse} from '../../model/dto/reviewDTO/productReviewsResponse.model';
import {Page} from '../../model/page.model';


@Injectable({
  providedIn: 'root'
})

export class ReviewService {

  private readonly reviewUrl: string;

  constructor(private sharedService: SharedService, private http: HttpClient) {
    this.reviewUrl = `${this.sharedService.publicUrl}/reviews`;
  }

  getReviewsByProductId(
    productId: number,
    page = 0,
    size = 10
  ): Observable<ProductReviewsResponse> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    return this.http.get<ProductReviewsResponse>(
      `${this.reviewUrl}/product/${productId}`,
      { params }
    );
  }

  getMyReviews(
    page: number = 0,
    size: number = 10
  ): Observable<Page<MinimizedReviewResponse>> {

    const params = new HttpParams()
      .set('page', page)
      .set('size', size);

    return this.http.get<Page<MinimizedReviewResponse>>(
      `${this.reviewUrl}/my`,
      { params }
    );
  }

  createReview(request: ReviewRequest): Observable<ReviewResponse> {
    return this.http.post<ReviewResponse>(this.reviewUrl, request);
  }

  updateReview(id: number, request: ReviewRequest): Observable<ReviewResponse> {
    return this.http.put<ReviewResponse>(`${this.reviewUrl}/${id}`, request);
  }

  deleteReview(id: number): Observable<void> {
    return this.http.delete<void>(`${this.reviewUrl}/${id}`);
  }

}
