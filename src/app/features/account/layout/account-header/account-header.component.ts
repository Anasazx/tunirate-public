import { Component } from '@angular/core';
import {CommonModule} from '@angular/common';
import {Router, RouterLink} from '@angular/router';
import {SharedService} from '../../../../core/services/sharedService/shared.service';
import {AuthService} from '../../../auth/services/authService/auth.service';

@Component({
  selector: 'app-account-header',
  imports: [CommonModule, RouterLink],
  templateUrl: './account-header.component.html',
  styleUrl: './account-header.component.css'
})
export class AccountHeaderComponent {

  userMenuOpen = false;


  constructor(
    private router: Router,
    public sharedService: SharedService,
    public authService: AuthService
  ) {}

  toggleUserMenu(): void {
    this.userMenuOpen = !this.userMenuOpen;
  }

  goCompanyDashboard(): void {
    this.router.navigate(['/']); // future update
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }


}
