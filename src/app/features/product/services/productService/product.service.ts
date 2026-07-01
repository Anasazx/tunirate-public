import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SharedService } from '../../../../core/services/sharedService/shared.service';
import { Observable } from 'rxjs';
import { ProductResponse } from '../../models/productDTO/productResponse.model';
import { DetailedProduct } from '../../models/detailedProduct.model';



@Injectable({
  providedIn: 'root'
})



export class ProductService {

  readonly productUrl :String;

  constructor(private sharedService: SharedService, private http: HttpClient) {
    this.productUrl = this.sharedService.publicUrl + "/product"
  }

  getProducts(): Observable<ProductResponse[]> {
    return this.http.get<ProductResponse[]>(this.productUrl.toString());
  }


  getDetailedProductById(productId: number): Observable<DetailedProduct> {
    return this.http.get<DetailedProduct>(`${this.productUrl.toString()}/${productId}/details`);
  }


  getProductsByCompanyId(companyId: number): Observable<ProductResponse[]> {
    return this.http.get<ProductResponse[]>(
      `${this.productUrl.toString()}/company/${companyId}`
    );
  }

}
