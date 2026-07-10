import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  publicUrl = "/api";

  uploadPublicUrl = "/uploads";

  constructor() {}

  getImageUrl(imageUrl?: string | null): string {

    if (!imageUrl) {

      return 'https://placehold.co/600x400/EEE/31343C';

    }

    console.log("this is the link: ", `${this.uploadPublicUrl}/${imageUrl}`);

    return `${this.uploadPublicUrl}/${imageUrl}`;

  }

}
