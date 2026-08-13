import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SharedService } from '../../../../core/services/sharedService/shared.service';
import { SubcategoryResponse } from '../../../../core/models/dto/subcategoryDTO/subcategoryResponse.model';

@Injectable({
  providedIn: 'root'
})

export class SubcategoryService {

    private readonly subcategoryUrl: string;

    constructor(private sharedService: SharedService, private http: HttpClient) {
        this.subcategoryUrl = this.sharedService.publicUrl + '/subcategories';
    }

    getAllSubcategories(): Observable<SubcategoryResponse[]> {
        return this.http.get<SubcategoryResponse[]>(this.subcategoryUrl);
    }

}
