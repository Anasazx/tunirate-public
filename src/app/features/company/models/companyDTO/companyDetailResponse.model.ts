import {ProductStatus} from '../../../product/enums/productStatus.enum.model';
import {Country} from '../../../../core/model/enums/country.enum.model';
import {ProductResponse} from '../../../product/models/productDTO/productResponse.model';
import {SocialLink} from '../socialLink.model';

export interface CompanyDetailResponse {
  id: number;
  name: string;
  description?: string | null;
  logoUrl?: string;
  bannerUrl?: string;
  phoneNumber: string;
  websiteUrl: string;
  address: string;
  country: Country;
  industry: String,
  socialLinks: SocialLink[];
  products: ProductResponse[];
  status: ProductStatus;



}


