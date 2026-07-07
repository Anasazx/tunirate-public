import { MinimizedUserResponse } from '../../../user/models/userDTO/minimizedUserResponse.model';

export interface AuthResponse {
    token: string;
    user: MinimizedUserResponse;
}
