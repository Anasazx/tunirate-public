import { AuthUserDto } from '../../../user/models/userDTO/authUserDto.model';

export interface AuthResponse {
    token: string;
    user: AuthUserDto;
}
