import { CommonModule, Location } from '@angular/common';
import {Component, HostListener, OnInit} from '@angular/core';
import { FormsModule } from '@angular/forms';
import {ActivatedRoute, RouterLink} from '@angular/router';
import { ReviewResponse } from '../../../../core/model/dto/reviewDTO/reviewResponse.model';
import { DetailedProduct } from '../../models/detailedProduct.model';
import { CommentResponse } from '../../../../core/model/dto/commentDTO/commentResponse.model';
import { ProductService } from '../../services/productService/product.service';
import { SharedService } from '../../../../core/services/sharedService/shared.service';
import { ReviewService } from '../../../../core/services/reviewService/review.service';
import { CommentService } from '../../../../core/services/commentService/comment.service';
import { ReviewRequest } from '../../../../core/model/dto/reviewDTO/reviewRequest.model';
import {ReviewFormComponent} from './components/review-form/review-form.component';


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
  imports: [CommonModule, FormsModule, RouterLink, ReviewFormComponent],
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
  hoveredRating = 0;

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

  // ===================== INIT =====================
  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
    private location: Location,
    public sharedService: SharedService,
    private reviewService: ReviewService,
    private commentService: CommentService
  ) {}

  ngOnInit() {
    const productId = this.route.snapshot.paramMap.get('id');
    if (productId) this.loadProduct(+productId);
    this.selectedImage = this.product?.images?.[0]?.url || null;

  }

  // ===================== LOAD PRODUCT =====================
  loadProduct(id: number) {
    this.productId = id;
    this.productService.getDetailedProductById(id).subscribe({
      next: (data) => {
        this.product = data;
        const mainImage =
          data.images?.find(i => i.isMain) ?? data.images?.[0];
        this.selectedImage = mainImage?.url ?? null;
        this.loadReviews();
      },
      error: console.error
    });
  }

  // ===================== LOAD REVIEWS =====================
  private loadReviews() {

    if (this.loading || this.last) return;

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


          let newReviews = response.reviews.content
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


          // Add my review first only on the first page
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
        },

        error: err => {
          console.error(err);
          this.loading = false;
        }

      });

  }
  // ===================== REVIEW CRUD =====================
  submitReview(request: ReviewRequest) {

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
        this.submittingReview = false;
      },
      error: err => {
        console.error(err);
        this.submittingReview = false;
      }
    });

  }

  deleteReview(review: ReviewResponse) {
    if (!review.isMine || !this.product) return;

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

    if (!this.product?.images?.length) return;

    this.currentImageIndex =

      (this.currentImageIndex + 1) % this.product.images.length;

    this.selectedImage = this.product.images[this.currentImageIndex].url;

  }

  prevImage() {

    if (!this.product?.images?.length) return;

    this.currentImageIndex =
      (this.currentImageIndex - 1 + this.product.images.length) %
      this.product.images.length;

    this.selectedImage = this.product.images[this.currentImageIndex].url;

  }

  @HostListener('window:scroll')
  onScroll() {
    const position =
      window.innerHeight + window.scrollY;
    const height =
      document.documentElement.scrollHeight;
    if (position >= height - 300) {
      this.loadReviews();
    }
  }

}
