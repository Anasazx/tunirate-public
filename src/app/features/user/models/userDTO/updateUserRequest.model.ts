import {Country} from '../../../../core/model/enums/country.enum.model';

export interface UpdateUserRequest {
  email: string;
  phoneNumber: string;
  country: Country;
}
