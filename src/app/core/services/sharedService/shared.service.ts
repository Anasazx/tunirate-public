import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  publicUrl = "https://anasazx.tech/api";


  constructor() {}

  getImageUrl(imageUrl?: string | null): string {
    if (!imageUrl) {
      return 'https://placehold.co/600x400/EEE/31343C';
    }
    return `${imageUrl}`;
  }

}
