import {Component, HostListener, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CompanyService } from '../../services/companyService/company.service';
import { SharedService } from '../../../../core/services/sharedService/shared.service';
import {ProductStatus} from '../../../product/enums/productStatus.enum.model';
import {CompanyDetailResponse} from '../../models/companyDTO/companyDetailResponse.model';
import {ProductResponse} from '../../../product/models/productDTO/productResponse.model';
import {SOCIAL_ICON_MAP} from '../../../../core/mapping/social-icon-map';
import {ProductService} from '../../../product/services/productService/product.service';
import {CompanyStatus} from '../../enums/companyStatus.enum.model';
import {ImageUrlPipe} from '../../../../core/pipes/image-url.pipe';


@Component({
  selector: 'app-company-details',
  standalone: true,
  imports: [CommonModule, RouterLink, ImageUrlPipe],
  templateUrl: './company-details.component.html',
  styleUrl: './company-details.component.css'
})
export class CompanyDetailsComponent implements OnInit {

  company?: CompanyDetailResponse;

  products: ProductResponse[] = [];

  protected readonly ProductStatus = ProductStatus;

  companyId!: number;
  page = 0;
  size = 20;
  last = false;
  loading = false;



  socialIconMap = SOCIAL_ICON_MAP;

  constructor(
    private route: ActivatedRoute,
    private companyService: CompanyService,
    private productService: ProductService,
    public sharedService: SharedService
  ) {}

  ngOnInit(): void {

    this.route.paramMap.subscribe(params => {

      const id = Number(params.get('id'));
      if (!id) return;

      this.companyId = id;

      this.loadCompany();

      // IMPORTANT: first page load
      this.loadProducts();

    });

  }

  loadCompany() {
    this.companyService.getCompanyInfoById(this.companyId)
      .subscribe(res => {
        this.company = res;
      });
  }

  loadProducts() {

    if (this.loading || this.last) return;

    this.loading = true;

    this.productService
      .getCompanyProducts(this.companyId, this.page, this.size)
      .subscribe(res => {

        this.products = [
          ...this.products,
          ...res.content
        ];

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

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const scrollPosition =
      window.innerHeight + window.scrollY;
    const pageHeight =
      document.documentElement.scrollHeight;
    const nearBottom =
      scrollPosition >= pageHeight - 200;
    if (nearBottom) {
      this.loadProducts();
    }
  }

  protected readonly CompanyStatus = CompanyStatus;
}
