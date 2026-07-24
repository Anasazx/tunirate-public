import {Country} from '../../../../core/models/enums/country.enum.model';

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

