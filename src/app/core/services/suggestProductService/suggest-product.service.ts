import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SharedService } from '../sharedService/shared.service';
import { Observable } from 'rxjs';
import {ProductSuggestionRequest} from '../../models/dto/ProductSuggestionDTO/ProductSuggestionRequest.model';
import {ProductSuggestionResponse} from '../../models/dto/ProductSuggestionDTO/ProductSuggestionResponse.model';







@Injectable({
  providedIn: 'root'
})
export class SuggestProductService {


  private readonly suggestProductUrl: string;


  constructor(
    private sharedService: SharedService,
    private http: HttpClient
  ) {
    this.suggestProductUrl = `${this.sharedService.publicUrl}/suggestions`;
  }

  createSuggestion(request: ProductSuggestionRequest): Observable<ProductSuggestionResponse> {
    return this.http.post<ProductSuggestionResponse>(this.suggestProductUrl, request);
  }

  getMySuggestions(): Observable<ProductSuggestionResponse[]> {
    return this.http.get<ProductSuggestionResponse[]>(`${this.suggestProductUrl}/my`);
  }

}
