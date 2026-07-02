import {SocialPlatform} from '../enums/socialPlatform.enum.model';

export interface SocialLink {
  id: number;
  companyId: number;
  platform: SocialPlatform;
  url: string;
}







