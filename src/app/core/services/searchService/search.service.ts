import { Injectable } from '@angular/core';
import { SharedService } from '../sharedService/shared.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { CompanyResponse } from '../../../features/company/models/companyDTO/companyResponse.model';
import { ProductResponse } from '../../../features/product/models/productDTO/productResponse.model';
import { Observable } from 'rxjs';


export interface SearchResponse {
  products: ProductResponse[];
  companies: CompanyResponse[];
}


@Injectable({
  providedIn: 'root'
})


export class SearchService {

  private searchUrl: string;

  constructor(private sharedService: SharedService, private http: HttpClient) {
    this.searchUrl = `${this.sharedService.publicUrl}/search`;
  }




  search(query: string): Observable<SearchResponse> {
    const params = new HttpParams().set('query', query);
    return this.http.get<SearchResponse>(this.searchUrl, { params });
  }



}
