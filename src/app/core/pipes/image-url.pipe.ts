import { Pipe, PipeTransform } from '@angular/core';
import { SharedService } from '../services/sharedService/shared.service';

@Pipe({
  name:'imageUrl',
  standalone:true,
  pure:true
})

export class ImageUrlPipe implements PipeTransform {

  constructor(
    private sharedService:SharedService
  ){}

  transform(value: string | null | undefined): string | null {

    if (!value) {
      return 'https://placehold.co/600x400/EEE/31343C';
    }

    // Already a full URL (Google, Facebook, etc.)
    if (value.startsWith('http://') || value.startsWith('https://')) {
      return value;
    }

    // Local uploaded image
    return this.sharedService.getImageUrl(value);

  }
}
