import { CommonModule, Location } from '@angular/common';
import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import { FormsModule } from '@angular/forms';
import {ActivatedRoute, RouterLink} from '@angular/router';
import { ReviewResponse } from '../../../../core/models/dto/reviewDTO/reviewResponse.model';
import { DetailedProduct } from '../../models/detailedProduct.model';
import { CommentResponse } from '../../../../core/models/dto/commentDTO/commentResponse.model';
import { ProductService } from '../../services/productService/product.service';
import { SharedService } from '../../../../core/services/sharedService/shared.service';
import { ReviewService } from '../../../../core/services/reviewService/review.service';
import { CommentService } from '../../../../core/services/commentService/comment.service';
import { ReviewRequest } from '../../../../core/models/dto/reviewDTO/reviewRequest.model';
import {ReviewFormComponent} from './components/review-form/review-form.component';
import {AuthService} from '../../../auth/services/authService/auth.service';
import {AuthRequiredComponent} from '../../../../core/sharedComponents/auth-required/auth-required.component';
import {ImageUrlPipe} from '../../../../core/pipes/image-url.pipe';


type ReviewWithComments = ReviewResponse & {
  showComments?: boolean;
  comments?: CommentResponse[];
  newComment?: string;
  commentsPage?: number;
  commentsTotal?: number;
  commentsLoading?: boolean;
};

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, ReviewFormComponent, AuthRequiredComponent, ImageUrlPipe],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.css',
})


export class ProductDetailsComponent implements OnInit {

  // ===================== STATE =====================
  product?: DetailedProduct;

  reviews: ReviewWithComments[] = [];

  myReview: ReviewResponse | null = null;

  reviewContent = '';
  selectedRating = 0;

  submittingReview = false;
  deletingReviewId: number | null = null;

  descExpanded = false;
  selectedImage: string | null = '';

  totalReviews: number = 0;

  page = 0;
  size = 10;
  last = false;
  loading = false;

  productId!: number;

  //Reply logic
  replyingToCommentId: number | null = null;
  replyText = '';

  currentImageIndex = 0;

  showAuthModal = false;

  // ===================== INIT =====================
  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
    private location: Location,
    public sharedService: SharedService,
    private reviewService: ReviewService,
    private commentService: CommentService,
    protected authService: AuthService
  ) {}

  ngOnInit() {
    const productId = this.route.snapshot.paramMap.get('id');
    if (productId) this.loadProduct(+productId);
  }

  // ===================== LOAD PRODUCT =====================
  loadProduct(id: number) {
    this.productId = id;

    this.productService.getDetailedProductById(id).subscribe({
      next: (data) => {

        this.product = data;

        const mainIndex = data.images?.findIndex(i => i.isMain) ?? -1;

        this.currentImageIndex = mainIndex >= 0 ? mainIndex : 0;

        this.selectedImage =
          data.images?.[this.currentImageIndex]?.url ?? null;

        this.loadReviews();
      },
      error: console.error
    });
  }


  showAuthModelIfNoAuthUser(): boolean {
    if (!this.authService.getCurrentUser) {
      this.showAuthModal = true;
      return true;
    }
    return false;
  }

  // ===================== REVIEW CRUD =====================
  submitReview(request: ReviewRequest) {

    if (this.showAuthModelIfNoAuthUser()) {
      return;
    }

    this.submittingReview = true;

    const request$ = this.myReview
      ? this.reviewService.updateReview(this.myReview.id, request)
      : this.reviewService.createReview(request);

    request$.subscribe({
      next: (res) => {
        const saved = res as ReviewResponse;

        if (this.myReview) {
          this.reviews = this.reviews.map(r =>
            r.id === this.myReview!.id
              ? { ...saved, comments: r.comments, showComments: r.showComments }
              : r
          );
        } else {
          this.reviews = [
            { ...saved, comments: [], showComments: false },
            ...this.reviews
          ];
        }

        this.myReview = saved;
        this.product!.reviewsCount = this.reviews.length;
        this.product!.reviews = this.reviews;
        this.submittingReview = false;
      },
      error: err => {
        console.error(err);
        this.submittingReview = false;
      }
    });

  }

  reviewIsMine(id: number): boolean {
    return id === this.authService.getCurrentUser?.id;
  }

  deleteReview(review: ReviewResponse) {

    console.log("this is the current user: ", this.authService.getCurrentUser)

    if (!this.reviewIsMine(review.user.id) || !this.product) return;

    if (!confirm('Delete your review?')) return;

    this.deletingReviewId = review.id;

    this.reviewService.deleteReview(review.id).subscribe({
      next: () => {

        this.reviews = this.reviews.filter(r => r.id !== review.id);
        this.product!.reviews = this.reviews;

        this.deletingReviewId = null;
      },
      error: err => {
        console.error(err);
        this.deletingReviewId = null;
      }
    });
  }

  hasLongDescription(description?: string): boolean {
    return (description?.length ?? 0) > 280;
  }

  // ===================== COMMENTS =====================
  addComment(review: ReviewWithComments) {

    if (!review.newComment?.trim()) return;

    this.commentService.createComment(review.id, {
      content: review.newComment
    }).subscribe({
      next: (comment) => {

        review.comments = [comment, ...(review.comments || [])];

        review.commentsCount = (review.commentsCount || 0) + 1;

        review.newComment = '';
      },
      error: console.error
    });
  }

  loadComments(review: ReviewResponse & any) {

    if (review.commentsLoading) return;

    review.commentsLoading = true;

    this.commentService
      .getCommentsByReviewId(review.id, review.commentsPage ?? 0, 4)
      .subscribe({

        next: (response) => {

          review.comments = [
            ...(review.comments || []),
            ...response.content
          ];

          review.commentsTotal = response.totalElements;

          review.commentsPage = (review.commentsPage ?? 0) + 1;

          review.commentsLoading = false;
          review.showComments = true;
        },

        error: err => {
          console.error(err);
          review.commentsLoading = false;
        }

      });
  }

  toggleComments(review: ReviewResponse & any) {
    if (!review.showComments && (!review.comments || review.comments.length === 0)) {
      this.loadComments(review);
    } else {
      review.showComments = !review.showComments;
    }
  }

  // ===================== UI HELPERS =====================
  getSolidStars(rating: number) {
    return Array(Math.floor(rating));
  }

  getOutlineStars(rating: number) {
    return Array(5 - Math.floor(rating));
  }

  getStarPercent(star: number): number {
    if (!this.reviews.length) return 0;
    const count = this.reviews.filter(r => Math.floor(r.rating) === star).length;
    return Math.round((count / this.reviews.length) * 100);
  }

  goBack() {
    this.location.back();
  }

  startReply(comment: any) {
    if (this.showAuthModelIfNoAuthUser()) {
      return;
    }
    this.replyingToCommentId = comment.id;
    this.replyText = '';
  }

  cancelReply() {
    this.replyingToCommentId = null;
    this.replyText = '';
  }

  sendReply(comment: any) {

    if (!this.replyText.trim()) return;

    const request = {
      content: this.replyText,
      reviewId: comment.reviewId
    };

    this.commentService.replyToComment(comment.id, request).subscribe({
      next: (newReply) => {

        // find review
        const review = this.reviews.find(r => r.id === comment.reviewId);

        if (!review) return;

        // init array if needed
        if (!review.comments) {
          review.comments = [];
        }

        // 👇 add new reply instantly (OPTIMISTIC UI)
        review.comments = [...review.comments, newReply];

        // update count
        review.commentsCount = (review.commentsCount || 0) + 1;

        // reset UI
        this.replyingToCommentId = null;
        this.replyText = '';
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  nextImage() {
    const images = this.product?.images;

    if (!images?.length) return;

    this.currentImageIndex =
      (this.currentImageIndex + 1) % images.length;

    this.selectedImage = images[this.currentImageIndex].url;
  }

  prevImage() {
    const images = this.product?.images;

    if (!images?.length) return;

    this.currentImageIndex =
      (this.currentImageIndex - 1 + images.length) % images.length;

    this.selectedImage = images[this.currentImageIndex].url;
  }


  private observer?: IntersectionObserver;

  ngOnDestroy() {
    this.observer?.disconnect();
  }

  private requestInProgress = false;

  // ===================== LOAD REVIEWS =====================
  private loadReviews() {

    console.log("log reviews method called!!")

    if (this.requestInProgress || this.last) return;

    this.requestInProgress = true;
    this.loading = true;

    this.reviewService
      .getReviewsByProductId(this.productId, this.page, this.size)
      .subscribe({
        next: (response) => {

          this.totalReviews = response.reviews.totalElements;

          if (this.page === 0) {
            this.myReview = response.myReview;

            if (this.myReview) {
              this.reviewContent = this.myReview.content ?? '';
              this.selectedRating = this.myReview.rating ?? 0;
            }
          }

          const newReviews = response.reviews.content
            .filter(r => !this.myReview || r.id !== this.myReview.id)
            .map(r => ({
              ...r,
              showComments: false,
              comments: [],
              newComment: '',
              commentsPage: 0,
              commentsTotal: r.commentsCount ?? 0,
              commentsLoading: false
            }));

          if (this.page === 0 && this.myReview) {

            const myReviewWithState = {
              ...this.myReview,
              showComments: false,
              comments: [],
              newComment: '',
              commentsPage: 0,
              commentsTotal: this.myReview.commentsCount ?? 0,
              commentsLoading: false
            };

            this.reviews = [
              myReviewWithState,
              ...newReviews
            ];

          } else {

            this.reviews = [
              ...this.reviews,
              ...newReviews
            ];

          }

          this.product!.reviews = this.reviews;

          this.page++;
          this.last = response.reviews.last;

          this.loading = false;
          this.requestInProgress = false;
        },

        error: (err) => {
          console.error(err);
          this.loading = false;
          this.requestInProgress = false;
        }
      });
  }

  @ViewChild('loadMoreTrigger')
  loadMoreTrigger?: ElementRef;
  ngAfterViewInit() {
    if (!this.loadMoreTrigger) return;
    this.observer = new IntersectionObserver(
      entries => {
        if (
          entries[0].isIntersecting &&
          !this.loading &&
          !this.last
        ) {
          this.loadReviews();
        }
      },
      {
        rootMargin: '100px'
      }
    );
    this.observer.observe(
      this.loadMoreTrigger.nativeElement
    );
  }

}
