import { Injectable } from '@angular/core';
import { SharedService } from '../sharedService/shared.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {SearchResponse} from '../../models/dto/searchDTO/searchResponse.model';


@Injectable({
  providedIn: 'root'
})


export class SearchService {

  private readonly searchUrl: string;

  constructor(private sharedService: SharedService, private http: HttpClient) {
    this.searchUrl = `${this.sharedService.publicUrl}/search`;
  }

  search(query: string): Observable<SearchResponse> {
    const params = new HttpParams().set('query', query);
    return this.http.get<SearchResponse>(this.searchUrl, { params });
  }

}
