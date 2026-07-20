import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AccountHeaderComponent } from '../account-header/account-header.component';
import { AccountSidebarComponent } from '../account-sidebar/account-sidebar.component';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-account-layout',
  imports: [
    RouterOutlet,
    AccountHeaderComponent,
    AccountSidebarComponent,
    CommonModule
  ],
  templateUrl: './account-layout.component.html',
  styleUrl: './account-layout.component.css'
})
export class AccountLayoutComponent {
  sidebarOpen = false;
}
