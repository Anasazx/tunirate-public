import {UserStatus} from '../../enums/userStatus.enum.model';

export interface UserResponse {
  id: number;
  name: string;
  email: string;
  emailVerified: boolean;
  avatarUrl: string | null;
  phoneNumber: string;
  country: string;
  status: UserStatus;
  createdAt: string;
}
