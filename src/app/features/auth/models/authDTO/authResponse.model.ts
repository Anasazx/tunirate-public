import {AuthUserResponse} from '../../../user/models/userDTO/authUserResponse.model';

export interface AuthResponse {
    token: string;
    user: AuthUserResponse;
}
