import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CompanyService } from '../../services/companyService/company.service';
import { ProductService } from '../../../product/services/productService/product.service';
import { SharedService } from '../../../../core/services/sharedService/shared.service';
import {CompanyResponse} from '../../models/companyDTO/companyResponse.model';
import {ProductStatus} from '../../../product/enums/productStatus.enum.model';
import {CompanyDetailResponse} from '../../models/companyDTO/companyDetailResponse.model';
import {ProductResponse} from '../../../product/models/productDTO/productResponse.model';


@Component({
  selector: 'app-company-details',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './company-details.component.html',
  styleUrl: './company-details.component.css'
})
export class CompanyDetailsComponent implements OnInit {

  company?: CompanyDetailResponse;
  products?: ProductResponse[];

  constructor(
    private route: ActivatedRoute,
    private companyService: CompanyService,
    public sharedService: SharedService
  ) {}

  ngOnInit(): void {

    this.route.paramMap.subscribe(params => {
      const id = Number(params.get('id'));

      if (!id) return;

      this.loadCompany(id);

    });

  }

  loadCompany(id: number) {
    this.companyService.getCompanyById(id)
      .subscribe(

        res => {
          this.company = res;
          this.products = this.company.products;

          console.log(this.company)
          console.log(this.products)

        }

      );
  }

  protected readonly ProductStatus = ProductStatus;
}
