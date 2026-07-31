import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SharedService } from '../sharedService/shared.service';
import { CommentRequest } from '../../models/dto/commentDTO/commentRequest.model';
import { CommentResponse } from '../../models/dto/commentDTO/commentResponse.model';
import {Page} from '../../models/page.model';
import {LikeStatus} from '../../models/dto/like-status.model';

@Injectable({
  providedIn: 'root'
})

export class CommentService {

  private readonly commentUrl: string;

  constructor(
    private sharedService: SharedService,
    private http: HttpClient
  ) {
    this.commentUrl = this.sharedService.publicUrl + '/comments';
  }

  //Get all comments for a review
  getCommentsByReviewId(
    reviewId: number,
    page: number = 0,
    size: number = 4
  ): Observable<Page<CommentResponse>> {
    return this.http.get<Page<CommentResponse>>(
      `${this.commentUrl}/review/${reviewId}?page=${page}&size=${size}`
    );
  }

  //Create comment
  createComment(reviewId: number, request: CommentRequest): Observable<CommentResponse> {
    return this.http.post<CommentResponse>(
      `${this.commentUrl}/review/${reviewId}`,
      request
    );
  }

  //Reply to comment
  replyToComment(parentCommentId: number, request: CommentRequest): Observable<CommentResponse> {
    return this.http.post<CommentResponse>(
      `${this.commentUrl}/reply/${parentCommentId}`,
      request
    );
  }

  // Like comment
  addLike(commentId: number): Observable<LikeStatus> {
    return this.http.post<LikeStatus>(
      `${this.commentUrl}/${commentId}/likes`,
      {}
    );
  }

  // Remove like
  removeLike(commentId: number): Observable<LikeStatus> {
    return this.http.delete<LikeStatus>(
      `${this.commentUrl}/${commentId}/likes`
    );
  }

}
