import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SharedService } from '../../../../core/services/sharedService/shared.service';
import {CompanyDetailResponse} from '../../models/companyDTO/companyDetailResponse.model';
import {CompanyResponse} from '../../models/companyDTO/companyResponse.model';
import {PageResponse} from '../../../../core/models/page.model';


@Injectable({
  providedIn: 'root'
})


export class CompanyService {

  private readonly companyUrl;

  constructor(private sharedService: SharedService, private http: HttpClient) {
    this.companyUrl = this.sharedService.publicUrl + '/company';
  }

  getCompanyInfoById(id: number): Observable<CompanyDetailResponse> {
    return this.http.get<CompanyDetailResponse>(`${this.companyUrl}/details/${id}`);
  }

  getCompanies(page: number = 0, size: number = 20): Observable<PageResponse<CompanyResponse>> {
    const params = new HttpParams()
      .set('page', page)
      .set('size', size);

    return this.http.get<PageResponse<CompanyResponse>>(`${this.companyUrl}/all`, { params });
  }


}
