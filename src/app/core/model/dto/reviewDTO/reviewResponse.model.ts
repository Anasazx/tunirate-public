import { CommentResponse } from "../commentDTO/commentResponse.model";
import {MinimizedUserResponse} from '../../../../features/user/models/userDTO/minimizedUserResponse.model';

export interface ReviewResponse {
  id: number;
  rating: number;
  content: string;
  user: MinimizedUserResponse;
  commentsCount: number;
  previewComment?: CommentResponse;
  createdAt: string;


  // UI ONLY (frontend state)
  showComments?: boolean;
  comments?: CommentResponse[];
  newComment?: string;

}
