import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SharedService } from '../sharedService/shared.service';
import {Observable} from 'rxjs';
import {FeedResponse} from '../../models/dto/feedResponse';


@Injectable({
  providedIn: 'root'
})

export class FeedService {

  private readonly feedUrl: string;

  constructor(private sharedService: SharedService, private http: HttpClient) {
    this.feedUrl = `${this.sharedService.publicUrl}/feed`;
  }

  getFeed(): Observable<FeedResponse> {
    return this.http.get<FeedResponse>(this.feedUrl);
  }

}
