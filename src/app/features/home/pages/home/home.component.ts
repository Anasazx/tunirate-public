import { CommonModule } from '@angular/common';
import {Component, HostListener, OnInit} from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProductService } from '../../../product/services/productService/product.service';
import { SharedService } from '../../../../core/services/sharedService/shared.service';
import { ProductResponse } from '../../../product/models/productDTO/productResponse.model';
import {ImageUrlPipe} from '../../../../core/pipes/image-url.pipe';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, ImageUrlPipe],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})

export class HomeComponent implements OnInit{

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
    public sharedService: SharedService
  ){}

  products: ProductResponse[] = [];
  filteredProducts: ProductResponse[] = [];
  selectedCategory = 'All';
  selectedSubcategory = 'All';

  page = 0;
  size = 20;
  last = false;
  loading = false;

  ngOnInit(): void {

    this.route.queryParamMap.subscribe(params => {

      this.selectedCategory =

        params.get('category') || 'All';

      this.selectedSubcategory =

        params.get('subcategory') || 'All';

      this.products = [];

      this.page = 0;

      this.last = false;

      this.loadProducts();

    });

  }

  loadProducts() {

    if (this.loading || this.last) return;

    this.loading = true;

    this.productService.getProducts(this.page, this.size)
      .subscribe({
        next: (response) => {
          this.products.push(...response.content);
          this.page++;
          this.last = response.last;
          this.loading = false;
          this.applyFilters();
        },
        error: err => {
          console.error(err);
          this.loading = false;
        }
      });

  }

  applyFilters() {

    this.filteredProducts = this.products.filter(product => {

      const productCategory =
        product.categoryName ?? product.category;

      const productSubcategory =
        product.subcategoryName ??
        product.subcategory ??
        product.category;

      const matchesCategory =
        this.selectedCategory === 'All' ||
        productCategory === this.selectedCategory;

      const matchesSubcategory =
        this.selectedSubcategory === 'All' ||
        productSubcategory === this.selectedSubcategory;

      return matchesCategory && matchesSubcategory;

    });

  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const nearBottom =
      window.innerHeight + window.scrollY + 300 >=
      document.documentElement.scrollHeight;
    if (!nearBottom || this.loading || this.last) return;
    this.loadProducts();
  }

}
