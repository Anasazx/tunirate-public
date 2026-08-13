import { CommonModule } from '@angular/common';
import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductCardComponent } from '../../../../core/sharedComponents/product-card/product-card.component';
import { SubcategoryResponse } from '../../../../core/models/dto/subcategoryDTO/subcategoryResponse.model';
import { SubcategoryService } from '../../../home/services/subcategoryService/subcategory.service';
import {DEFAULT_SUBCATEGORY_ICON, SUBCATEGORY_ICONS} from '../../../../core/constants/subcategory-icons';
import {ProductService} from '../../services/productService/product.service';
import {ProductResponse} from '../../models/productDTO/productResponse.model';

type SortOption = 'relevance' | 'rating' | 'reviews' | 'newest';

@Component({
  selector: 'app-all-products',
  standalone: true,
  imports: [CommonModule, ProductCardComponent],
  templateUrl: './all-products.component.html',
  styleUrl: './all-products.component.css'
})
export class AllProductsComponent implements OnInit {

  constructor(
    private productService: ProductService,
    private subcategoryService: SubcategoryService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  products: ProductResponse[] = [];
  subcategories: SubcategoryResponse[] = [];

  loading = true;
  loadingMore = false;
  showFilters = false; // mobile toggle

  protected readonly SUBCATEGORY_ICONS = SUBCATEGORY_ICONS;
  protected readonly DEFAULT_SUBCATEGORY_ICON = DEFAULT_SUBCATEGORY_ICON;

  selectedSubcategoryId?: number;
  selectedSubcategory = 'All';
  sortBy: SortOption = 'relevance';

  currentPage = 0;
  pageSize = 12;
  totalElements = 0;
  isLastPage = false;

  ngOnInit(): void {
    this.loadSubcategories();

    this.route.queryParamMap.subscribe(params => {
      this.selectedSubcategoryId = params.get('subcategoryId') ? Number(params.get('subcategoryId')) : undefined;
      this.selectedSubcategory = params.get('subcategory') || 'All';

      this.products = [];
      this.currentPage = 0;
      this.isLastPage = false;
      this.loading = true;
      this.loadProducts();
    });
  }

  loadSubcategories() {
    this.subcategoryService.getAllSubcategories().subscribe({
      next: (response) => this.subcategories = response,
      error: (err) => console.error(err)
    });
  }

  get sortParam(): string | undefined {
    switch (this.sortBy) {
      case 'rating': return 'reviewsAvg,desc';
      case 'reviews': return 'reviewCount,desc';
      case 'newest': return 'createdAt,desc';
      default: return undefined; // relevance = no explicit sort
    }
  }

  loadProducts() {
    this.productService
      .getProducts(this.currentPage, this.pageSize, undefined, this.selectedSubcategoryId, this.sortParam)
      .subscribe({
        next: (response) => {
          this.products.push(...response.content);
          this.totalElements = response.totalElements;
          this.isLastPage = response.last;
          this.loading = false;
          this.loadingMore = false;
        },
        error: (err) => {
          console.error(err);
          this.loading = false;
          this.loadingMore = false;
        }
      });
  }

  loadMore() {
    if (this.isLastPage || this.loadingMore) return;
    this.loadingMore = true;
    this.currentPage++;
    this.loadProducts();
  }

  selectSubcategory(subcategory: SubcategoryResponse | null) {
    this.router.navigate(['/products'], {
      queryParams: {
        subcategoryId: subcategory?.id ?? null,
        subcategory: subcategory?.name ?? null
      }
    });
  }

  setSortBy(option: SortOption) {
    this.sortBy = option;
    this.products = [];
    this.currentPage = 0;
    this.isLastPage = false;
    this.loading = true;
    this.loadProducts();
  }

  @ViewChild('resultsContainer') resultsContainer?: ElementRef<HTMLDivElement>;
  lastResultsHeight = 0;

  ngAfterViewInit() {
    if (this.resultsContainer) {
      const ro = new ResizeObserver(entries => {
        const h = entries[0].contentRect.height;
        if (h > 0) this.lastResultsHeight = h;
      });
      ro.observe(this.resultsContainer.nativeElement);
    }
  }

}
