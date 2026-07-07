import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SharedService } from '../../../../core/services/sharedService/shared.service';
import { CategoryResponse } from '../../models/categoryDTO/categoryResponse.model';

@Injectable({
  providedIn: 'root'
})

export class CategoryService {

    private readonly categoryUrl: string;

    constructor(private sharedService: SharedService, private http: HttpClient) {
        this.categoryUrl = this.sharedService.publicUrl + '/categories';
    }

    getAllCategories(): Observable<CategoryResponse[]> {
        return this.http.get<CategoryResponse[]>(this.categoryUrl);
    }

}
