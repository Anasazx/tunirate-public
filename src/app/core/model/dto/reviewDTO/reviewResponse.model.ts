import { CommentResponse } from "../commentDTO/commentResponse.model";
import {MinimizedUserResponse} from '../../../../features/user/models/userDTO/authUserDto.model';

export interface ReviewResponse {
  id: number;
  rating: number;
  content: string;
  user: MinimizedUserResponse;
  isMine?: boolean;
  commentsCount: number;
  previewComment?: CommentResponse;
  createdAt: string;


  // UI ONLY (frontend state)
  showComments?: boolean;
  comments?: CommentResponse[];
  newComment?: string;

}
