import {ProductStatus} from '../../../product/enums/productStatus.enum.model';
import {Country} from '../../../../core/model/enums/country.enum.model';
import {SocialLink} from '../socialLink.model';
import {Industry} from '../../enums/industry.enum.model';

export interface CompanyDetailResponse {
  id: number;
  name: string;
  description?: string | null;
  logoUrl?: string;
  bannerUrl?: string;
  phoneNumber: string;
  address: string;
  country: Country;
  industry: Industry;
  socialLinks: SocialLink[];
  status: ProductStatus;
}


