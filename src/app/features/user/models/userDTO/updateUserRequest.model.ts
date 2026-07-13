import {Country} from '../../../../core/models/enums/country.enum.model';

export interface UpdateUserRequest {
  email: string;
  phoneNumber: string;
  country: Country;
}
