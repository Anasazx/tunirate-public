import { CommonModule } from '@angular/common';
import {Component, EventEmitter, HostListener, OnInit, Output} from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../features/auth/services/authService/auth.service';
import { SearchService } from '../../services/searchService/search.service';
import { CompanyInvitationService } from '../../../features/company/services/companyInvitationService/company-invitation.service';
import { SharedService } from '../../services/sharedService/shared.service';
import { NavbarComponent } from '../navbar/navbar.component';
import {filter} from 'rxjs';
import {MobileSidebarComponent} from '../mobile-sidebar/mobile-sidebar.component';
import {SearchBarComponent} from '../search-bar/search-bar.component';
import {ImageUrlPipe} from '../../pipes/image-url.pipe';


@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, NavbarComponent, MobileSidebarComponent, SearchBarComponent, ImageUrlPipe],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {

  @Output() searchChange = new EventEmitter<string>();

  invitations: any[] = [];
  invitationCount = 0;
  showInvitations = false;

  userMenuOpen = false;

  constructor(
    public authService: AuthService,
    private router: Router,
    private searchService: SearchService,
    private companyInvitationService: CompanyInvitationService,
    public sharedService: SharedService,
  ) {}

  ngOnInit() {
    this.authService.currentUser$.pipe(
      filter(user => !!user)
    ).subscribe(() => {
      this.loadInvitations();
    });
  }

  /* ---------------- AUTH ---------------- */

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }

  goCompanyDashboard(): void {
    this.router.navigate(['/']); // future update
  }

  toggleUserMenu(): void {
    this.userMenuOpen = !this.userMenuOpen;
    this.showInvitations = false;
    console.log(this.userMenuOpen)
  }

  /* ---------------- INVITATIONS ---------------- */

  toggleInvitations(): void {
    this.showInvitations = !this.showInvitations;
    this.userMenuOpen = false;
    if (this.showInvitations) this.loadInvitations();
  }

  loadInvitations(): void {
    this.companyInvitationService.getMyInvitations()
      .subscribe(res => {
        this.invitations = res;
        this.invitationCount = res.filter(i => i.status === 'PENDING').length;
      });
  }

  accept(id: number): void {
    this.companyInvitationService.acceptInvitation(id)
      .subscribe(() => this.loadInvitations());
  }

  reject(id: number): void {
    this.companyInvitationService.rejectInvitation(id)
      .subscribe(() => this.loadInvitations());
  }

  mobileMenuOpen = false;

  toggleMobileMenu() {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  @HostListener('document:click', ['$event'])
  closeMenus(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.user-menu')) {
      this.userMenuOpen = false;
    }
    if (!target.closest('.notification-menu')) {
      this.showInvitations = false;
    }
  }

}
