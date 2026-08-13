import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SharedService } from '../sharedService/shared.service';
import { SearchResponse } from '../../models/dto/searchDTO/searchResponse.model';
import {ProductResponse} from '../../../features/product/models/productDTO/productResponse.model';
import {PageResponse} from '../../models/page.model';
import {CompanyResponse} from '../../../features/company/models/companyDTO/companyResponse.model';
import {SearchSuggestion} from '../../models/dto/searchDTO/searchSuggestion.model';

@Injectable({
  providedIn: 'root'
})

export class SearchService {

  private readonly searchUrl: string;

  constructor(
    private sharedService: SharedService,
    private http: HttpClient
  ) {
    this.searchUrl = `${this.sharedService.publicUrl}/search`;
  }

  // Combined search
  search(query: string, page: number = 0, size: number = 20): Observable<SearchResponse> {
    const params = new HttpParams()
      .set('query', query)
      .set('page', page)
      .set('size', size);

    return this.http.get<SearchResponse>(this.searchUrl, { params });
  }

  // Products only
  searchProducts(query: string, page: number = 0, size: number = 20): Observable<PageResponse<ProductResponse>> {
    const params = new HttpParams()
      .set('query', query)
      .set('page', page)
      .set('size', size);
    return this.http.get<PageResponse<ProductResponse>>(`${this.searchUrl}/products`, { params });
  }

  // Companies only
  searchCompanies(query: string, page: number = 0, size: number = 20): Observable<PageResponse<CompanyResponse>> {
    const params = new HttpParams()
      .set('query', query)
      .set('page', page)
      .set('size', size);

    return this.http.get<PageResponse<CompanyResponse>>(`${this.searchUrl}/companies`, { params });
  }

  // Autocomplete
  searchSuggestions(query: string): Observable<SearchSuggestion[]> {
    const params = new HttpParams().set('query', query);
    return this.http.get<SearchSuggestion[]>(`${this.searchUrl}/suggestions`, { params });
  }

}
