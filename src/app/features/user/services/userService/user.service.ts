import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SharedService } from '../../../../core/services/sharedService/shared.service';


@Injectable({ providedIn: 'root' })
export class UserService {
  private userUrl = '';

  constructor(private shared: SharedService, private http: HttpClient) {
    this.userUrl = this.shared.publicUrl + '/users';
  }



}
