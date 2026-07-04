import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AccountHeaderComponent } from '../account-header/account-header.component';
import { AccountSidebarComponent } from '../account-sidebar/account-sidebar.component';

@Component({
  selector: 'app-account-layout',
  imports: [
    RouterOutlet,
    AccountHeaderComponent,
    AccountSidebarComponent
  ],
  templateUrl: './account-layout.component.html',
  styleUrl: './account-layout.component.css'
})
export class AccountLayoutComponent {

}
