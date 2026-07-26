import { Injectable } from '@angular/core';
import {SharedService} from '../sharedService/shared.service';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class EmailVerificationService {

  private readonly emailUrl: string;

  constructor(private http: HttpClient, private sharedService: SharedService) {
    this.emailUrl = this.sharedService.publicUrl + '/email';
  }

  requestVerificationCode() {
    return this.http.post(`${this.emailUrl}/request`, {});
  }

  verifyEmail(code: string) {
    return this.http.post(`${this.emailUrl}/verify`, {
      code
    });
  }

}
