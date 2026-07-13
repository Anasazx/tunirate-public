import {ProductResponse} from '../../../../features/product/models/productDTO/productResponse.model';
import {CompanyResponse} from '../../../../features/company/models/companyDTO/companyResponse.model';

export interface SearchResponse {
  products: ProductResponse[];
  companies: CompanyResponse[];
}
