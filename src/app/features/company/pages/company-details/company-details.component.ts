import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild, ElementRef, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ActivatedRoute, Router} from '@angular/router';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { CompanyService } from '../../services/companyService/company.service';
import { SharedService } from '../../../../core/services/sharedService/shared.service';
import { CompanyDetailResponse } from '../../models/companyDTO/companyDetailResponse.model';
import { ProductResponse } from '../../../product/models/productDTO/productResponse.model';
import { SOCIAL_ICON_MAP } from '../../../../core/mapping/social-icon-map';
import { ProductService } from '../../../product/services/productService/product.service';
import { CompanyStatus } from '../../enums/companyStatus.enum.model';
import { ImageUrlPipe } from '../../../../core/pipes/image-url.pipe';
import { ProductCardComponent } from '../../../../core/sharedComponents/product-card/product-card.component';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-company-details',
  standalone: true,
  imports: [CommonModule, ImageUrlPipe, ProductCardComponent, FormsModule],
  templateUrl: './company-details.component.html',
  styleUrl: './company-details.component.css'
})
export class CompanyDetailsComponent implements OnInit, OnDestroy, AfterViewInit {

  company?: CompanyDetailResponse;

  products: ProductResponse[] = [];

  totalProducts = 0;

  companyId!: number;
  page = 0;
  size = 21;
  last = false;
  loading = false;

  socialIconMap = SOCIAL_ICON_MAP;

  // FILTERS
  searchTerm = '';
  selectedSubcategoryId: number | null = null;

  private searchSubject = new Subject<string>();

  // HEIGHT STABILIZATION (prevents footer jump on filter change)
  @ViewChild('productsContainer') productsContainer?: ElementRef<HTMLDivElement>;
  lastProductsHeight = 0;
  private productsResizeObserver?: ResizeObserver;

  constructor(
    private route: ActivatedRoute,
    private companyService: CompanyService,
    private productService: ProductService,
    private ngZone: NgZone,
    public sharedService: SharedService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.searchSubject
      .pipe(debounceTime(400), distinctUntilChanged())
      .subscribe(() => this.resetAndLoadProducts());

    this.route.paramMap.subscribe(params => {

      const id = Number(params.get('id'));
      if (!id) return;

      this.companyId = id;
      this.searchTerm = '';
      this.selectedSubcategoryId = null;

      this.loadCompany();
      this.resetAndLoadProducts();

    });
  }

  ngAfterViewInit(): void {
    if (this.productsContainer) {
      this.productsResizeObserver = new ResizeObserver(entries => {
        const h = entries[0].contentRect.height;
        if (h > 0) {
          this.ngZone.run(() => (this.lastProductsHeight = h));
        }
      });
      this.productsResizeObserver.observe(this.productsContainer.nativeElement);
    }
  }

  ngOnDestroy(): void {
    this.searchSubject.complete();
    this.productsResizeObserver?.disconnect();
  }

  loadCompany() {
    this.companyService.getCompanyInfoById(this.companyId)
      .subscribe({
        next: (res) => {
          this.company = res;
        },
        error: (err) => {
          console.log(err)
          console.log(err.status)
          if (err.status === 403) {
            this.router.navigate(['/not-found'], { skipLocationChange: true });
          } else {
            console.error(err);
          }
        }
      });
  }

  onSearchChange(value: string): void {
    this.searchSubject.next(value);
  }

  selectSubcategory(id: number | null): void {
    if (this.selectedSubcategoryId === id) return;
    this.selectedSubcategoryId = id;
    this.resetAndLoadProducts();
  }

  private resetAndLoadProducts(): void {
    this.products = [];
    this.page = 0;
    this.last = false;
    this.loadProducts();
  }

  loadProducts() {

    if (this.loading || this.last) return;

    this.loading = true;

    this.productService
      .getCompanyProducts(this.companyId, this.page, this.size, this.searchTerm || undefined, this.selectedSubcategoryId ?? undefined)
      .subscribe(res => {

        this.products = [
          ...this.products,
          ...res.content
        ];

        this.totalProducts = res.totalElements;

        this.page++;
        this.last = res.last;
        this.loading = false;
      });

  }

  formatUrl(url: string): string {
    if (!url) return '#';
    return url.startsWith('http://') || url.startsWith('https://')
      ? url
      : 'https://' + url;
  }

  protected readonly CompanyStatus = CompanyStatus;
}
