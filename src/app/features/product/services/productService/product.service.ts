import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SharedService } from '../../../../core/services/sharedService/shared.service';
import { Observable } from 'rxjs';
import { ProductResponse } from '../../models/productDTO/productResponse.model';
import { DetailedProduct } from '../../models/detailedProduct.model';
import {Page} from '../../../../core/model/page.model';



@Injectable({
  providedIn: 'root'
})



export class ProductService {

  readonly productUrl :String;

  constructor(private sharedService: SharedService, private http: HttpClient) {
    this.productUrl = this.sharedService.publicUrl + "/product"
  }

  getProducts(page: number = 0, size: number = 20): Observable<Page<ProductResponse>> {
    return this.http.get<Page<ProductResponse>>(
      `${this.productUrl}?page=${page}&size=${size}`
    );
  }

  getDetailedProductById(productId: number): Observable<DetailedProduct> {
    return this.http.get<DetailedProduct>(`${this.productUrl.toString()}/${productId}/details`);
  }

}
