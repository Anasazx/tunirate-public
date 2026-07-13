import {Component, EventEmitter, Input, Output} from '@angular/core';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-auth-required',
  imports: [
    RouterLink
  ],
  templateUrl: './auth-required.component.html',
  styleUrl: './auth-required.component.css'
})
export class AuthRequiredComponent {

  @Input()
  message = 'You need an account to perform this action.';

  @Output()
  close = new EventEmitter<void>();


}
