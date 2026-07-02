import {ProductStatus} from '../../../product/enums/productStatus.enum.model';
import {Country} from '../../../../core/model/enums/country.enum.model';

export interface CompanyResponse {
  id: number;
  name: string;
  description?: string | null;
  logoUrl?: string;
  bannerUrl?: string;
  country: Country;
  status: ProductStatus;

}
