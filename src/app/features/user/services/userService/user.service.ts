import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SharedService } from '../../../../core/services/sharedService/shared.service';
import {Observable} from 'rxjs';
import {UserResponse} from '../../models/userDTO/userResponse.model';


@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly userUrl: string;

  constructor(private shared: SharedService, private http: HttpClient) {
    this.userUrl = this.shared.publicUrl + '/users';
  }





  getMyProfile(): Observable<UserResponse> {
    return this.http.get<UserResponse>(`${this.userUrl}/me`);
  }


  updateMyProfile(data: any): Observable<UserResponse> {
    return this.http.put<UserResponse>(`${this.userUrl}/me`, data);
  }




}
