import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SharedService } from '../../../../core/services/sharedService/shared.service';
import { CompanyRequest } from '../../models/companyDTO/companyRequest.model';
import { CompanyResponse } from '../../models/companyDTO/companyResponse.model';


@Injectable({
  providedIn: 'root'
})


export class CompanyService {

  private readonly companyUrl;

  constructor(private sharedService: SharedService, private http: HttpClient) {
    this.companyUrl = this.sharedService.publicUrl + '/company';
  }

  getCompanyById(id: number): Observable<CompanyResponse> {
    return this.http.get<CompanyResponse>(`${this.companyUrl}/${id}`);
  }

  getMyCompany(): Observable<CompanyResponse> {
    return this.http.get<CompanyResponse>(`${this.companyUrl}/my`);
  }

}
