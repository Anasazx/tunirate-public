import { CommonModule } from '@angular/common';
import { Component, ElementRef, NgZone, OnInit, AfterViewInit, OnDestroy, ViewChild } from '@angular/core';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import { SharedService } from '../../../../core/services/sharedService/shared.service';
import { ProductResponse } from '../../../product/models/productDTO/productResponse.model';
import { ProductCardComponent } from '../../../../core/sharedComponents/product-card/product-card.component';
import { AuthService } from '../../../auth/services/authService/auth.service';
import { MinimizedReviewResponse } from '../../../../core/models/dto/reviewDTO/minimizedReviewResponse.model';
import { SubcategoryResponse } from '../../../../core/models/dto/subcategoryDTO/subcategoryResponse.model';
import {DEFAULT_SUBCATEGORY_ICON, SUBCATEGORY_ICONS} from '../../../../core/constants/subcategory-icons';
import { FeedService } from '../../../../core/services/feedService/feed.service';
import { SearchBarComponent } from '../../../../core/layout/search-bar/search-bar.component';
import {CompanyResponse} from '../../../company/models/companyDTO/companyResponse.model';
import {ImageUrlPipe} from '../../../../core/pipes/image-url.pipe';
import {CompanyStatus} from '../../../company/enums/companyStatus.enum.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ProductCardComponent, RouterLink, SearchBarComponent, ImageUrlPipe],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit, AfterViewInit, OnDestroy {

  constructor(
    private feedService: FeedService,
    private route: ActivatedRoute,
    private router: Router,
    private ngZone: NgZone,
    public authService: AuthService,
    public sharedService: SharedService
  ) {}

  products: ProductResponse[] = [];
  reviews: MinimizedReviewResponse[] = [];
  categories: SubcategoryResponse[] = [];

  selectedCategory = 'All';
  selectedSubcategory = 'All';
  selectedCategoryId?: number;
  selectedSubcategoryId?: number;

  showNoProductFoundModel: boolean = false;

  companies: CompanyResponse[] = [];
  companyPages: CompanyResponse[][] = [];
  currentCompanyPage = 0;

  protected readonly SUBCATEGORY_ICONS = SUBCATEGORY_ICONS;

  ngOnInit(): void {
    this.route.queryParamMap.subscribe(params => {
      this.selectedCategoryId = params.get('categoryId') ? Number(params.get('categoryId')) : undefined;
      this.selectedSubcategoryId = params.get('subcategoryId') ? Number(params.get('subcategoryId')) : undefined;
      this.selectedCategory = params.get('category') || 'All';
      this.selectedSubcategory = params.get('subcategory') || 'All';

      this.products = [];
      this.reviews = [];
      this.categories = [];

      this.loadFeed();
    });
  }

  ngAfterViewInit(): void {
    this.updateCategoryScrollState();

    if (this.categoriesScroll) {
      this.categoriesResizeObserver = new ResizeObserver(() => {
        this.ngZone.run(() => this.updateCategoryScrollState());
      });
      this.categoriesResizeObserver.observe(this.categoriesScroll.nativeElement);
    }
  }

  ngOnDestroy(): void {
    this.categoriesResizeObserver?.disconnect();
  }

  // ========================== REVIEWS CAROUSEL (3x3 pages) ==========================
  reviewPages: MinimizedReviewResponse[][] = [];
  currentPage = 0;

  buildReviewPages() {
    const pageSize = 9;
    this.reviewPages = [];
    for (let i = 0; i < this.reviews.length; i += pageSize) {
      this.reviewPages.push(this.reviews.slice(i, i + pageSize));
    }
  }

  get canGoLeft(): boolean {
    return this.currentPage > 0;
  }

  get canGoRight(): boolean {
    return this.currentPage < this.reviewPages.length - 1;
  }

  scrollReviews(direction: 'left' | 'right') {
    if (direction === 'left' && this.canGoLeft) {
      this.currentPage--;
    } else if (direction === 'right' && this.canGoRight) {
      this.currentPage++;
    }
  }

  // ========================== PRODUCTS CAROUSEL (3x2 pages) ==========================
  productPages: ProductResponse[][] = [];
  currentProductPage = 0;

  buildProductPages() {
    const pageSize = 6;
    this.productPages = [];
    for (let i = 0; i < this.products.length; i += pageSize) {
      this.productPages.push(this.products.slice(i, i + pageSize));
    }
  }

  get canGoLeftProducts(): boolean {
    return this.currentProductPage > 0;
  }

  get canGoRightProducts(): boolean {
    return this.currentProductPage < this.productPages.length - 1;
  }

  scrollProducts(direction: 'left' | 'right') {
    if (direction === 'left' && this.canGoLeftProducts) {
      this.currentProductPage--;
    } else if (direction === 'right' && this.canGoRightProducts) {
      this.currentProductPage++;
    }
  }

  // ========================== CATEGORIES SCROLL STRIP ==========================
  @ViewChild('categoriesScroll') categoriesScroll?: ElementRef<HTMLDivElement>;

  canGoLeftCategories = false;
  canGoRightCategories = false;

  private categoriesResizeObserver?: ResizeObserver;

  onCategoriesScroll() {
    this.updateCategoryScrollState();
  }


  goToCategory(subcategory: SubcategoryResponse): void {
    this.router.navigate(['/products'], {
      queryParams: {
        subcategoryId: subcategory.id,
        subcategory: subcategory.name
      }
    });
  }

  updateCategoryScrollState() {
    if (!this.categoriesScroll) return;
    const el = this.categoriesScroll.nativeElement;
    this.canGoLeftCategories = el.scrollLeft > 4;
    this.canGoRightCategories = el.scrollLeft < el.scrollWidth - el.clientWidth - 4;
  }

  scrollCategories(direction: 'left' | 'right') {
    if (!this.categoriesScroll) return;
    const container = this.categoriesScroll.nativeElement;
    const scrollAmount = 240;
    container.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth'
    });
    setTimeout(() => this.updateCategoryScrollState(), 350);
  }

  // ========================== DATA LOADING ==========================
  loadFeed() {
    this.showNoProductFoundModel = false;

    this.feedService.getFeed()
      .subscribe({
        next: (response) => {
          this.showNoProductFoundModel = true;

          this.categories = response.categories;
          this.reviews = response.reviews;
          this.products = response.products;
          this.companies = response.companies;

          this.buildProductPages();
          this.buildReviewPages();
          this.buildCompanyPages();

          // ResizeObserver will pick up the layout change automatically,
          // but this gives a same-tick fallback too
          requestAnimationFrame(() => this.updateCategoryScrollState());
        },
        error: err => {
          this.showNoProductFoundModel = true;
          console.error(err);
        }
      });
  }

  protected readonly DEFAULT_SUBCATEGORY_ICON = DEFAULT_SUBCATEGORY_ICON;




  buildCompanyPages() {
    const pageSize = 6; // 3 columns x 2 rows
    this.companyPages = [];
    for (let i = 0; i < this.companies.length; i += pageSize) {
      this.companyPages.push(this.companies.slice(i, i + pageSize));
    }
  }

  get canGoLeftCompanies(): boolean {
    return this.currentCompanyPage > 0;
  }

  get canGoRightCompanies(): boolean {
    return this.currentCompanyPage < this.companyPages.length - 1;
  }

  scrollCompanies(direction: 'left' | 'right') {
    if (direction === 'left' && this.canGoLeftCompanies) {
      this.currentCompanyPage--;
    } else if (direction === 'right' && this.canGoRightCompanies) {
      this.currentCompanyPage++;
    }
  }

  protected readonly CompanyStatus = CompanyStatus;
}
