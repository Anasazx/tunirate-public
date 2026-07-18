import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { SharedService } from '../../../../core/services/sharedService/shared.service';
import { Observable } from 'rxjs';
import { ProductResponse } from '../../models/productDTO/productResponse.model';
import { DetailedProduct } from '../../models/detailedProduct.model';
import {Page} from '../../../../core/models/page.model';


@Injectable({
  providedIn: 'root'
})

export class ProductService {

  readonly productUrl: string;

  constructor(private sharedService: SharedService, private http: HttpClient) {
    this.productUrl = this.sharedService.publicUrl + "/product"
  }

  getProducts(page: number = 0, size: number = 20, categoryId?: number, subcategoryId?: number): Observable<Page<ProductResponse>> {

    let params = new HttpParams()
      .set('page', page)
      .set('size', size);

    if (categoryId) {
      params = params.set('categoryId', categoryId);
    }

    if (subcategoryId) {
      params = params.set('subcategoryId', subcategoryId);
    }

    return this.http.get<Page<ProductResponse>>(this.productUrl, { params });
  }

  getDetailedProductById(productId: number): Observable<DetailedProduct> {
    return this.http.get<DetailedProduct>(`${this.productUrl.toString()}/${productId}/details`);
  }

  getCompanyProducts(companyId: number, page: number = 0, size: number = 20): Observable<Page<ProductResponse>> {
    return this.http.get<Page<ProductResponse>>(
      `${this.productUrl}/company/${companyId}`,
      {
        params: { page, size }
      }
    );
  }

}
