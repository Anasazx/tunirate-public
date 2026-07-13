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

  transform(value:string|null|undefined){
    return this.sharedService.getImageUrl(value);
  }

}
