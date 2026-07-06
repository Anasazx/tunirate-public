import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SharedService } from '../../../../core/services/sharedService/shared.service';
import {CompanyDetailResponse} from '../../models/companyDTO/companyDetailResponse.model';


@Injectable({
  providedIn: 'root'
})


export class CompanyService {

  private readonly companyUrl;

  constructor(private sharedService: SharedService, private http: HttpClient) {
    this.companyUrl = this.sharedService.publicUrl + '/company';
  }

  getCompanyById(id: number): Observable<CompanyDetailResponse> {
    return this.http.get<CompanyDetailResponse>(`${this.companyUrl}/details/${id}`);
  }

}
