import { Component } from '@angular/core';
import {RouterLink, RouterLinkActive} from '@angular/router';
import {SharedService} from '../../../../core/services/sharedService/shared.service';
import {AuthService} from '../../../auth/services/authService/auth.service';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-account-sidebar',
  imports: [
    RouterLink,
    CommonModule,
    RouterLinkActive
  ],
  templateUrl: './account-sidebar.component.html',
  styleUrl: './account-sidebar.component.css'
})
export class AccountSidebarComponent {

  constructor(
    public sharedService: SharedService,
    public authService: AuthService
  ) {}

}
