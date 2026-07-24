import { CommonModule } from '@angular/common';
import {Component, EventEmitter, HostListener, OnInit, Output} from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../features/auth/services/authService/auth.service';
import { CompanyInvitationService } from '../../../features/company/services/companyInvitationService/company-invitation.service';
import { SharedService } from '../../services/sharedService/shared.service';
import { NavbarComponent } from '../navbar/navbar.component';
import {filter} from 'rxjs';
import {MobileSidebarComponent} from '../mobile-sidebar/mobile-sidebar.component';
import {SearchBarComponent} from '../search-bar/search-bar.component';
import {ImageUrlPipe} from '../../pipes/image-url.pipe';
import {SuggestProductService} from '../../services/suggestProductService/suggest-product.service';
import {AuthRequiredComponent} from '../../sharedComponents/auth-required/auth-required.component';
import {animate, style, transition, trigger} from '@angular/animations';


@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, NavbarComponent, MobileSidebarComponent, SearchBarComponent, ImageUrlPipe, AuthRequiredComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
  animations: [
    trigger('toastAnimation', [
      transition(':enter', [
        style({
          opacity: 0,
          transform: 'translateX(100%)'
        }),
        animate(
          '300ms ease-out',
          style({
            opacity: 1,
            transform: 'translateX(0)'
          })
        )
      ]),
      transition(':leave', [
        animate(
          '300ms ease-in',
          style({
            opacity: 0,
            transform: 'translateX(100%)'
          })
        )
      ])
    ])
  ]
})
export class HeaderComponent implements OnInit {

  @Output() searchChange = new EventEmitter<string>();

  invitations: any[] = [];
  invitationCount = 0;
  showInvitations = false;

  userMenuOpen = false;

  logoutConfirmOpen = false;

  showAuthModal= false;

  constructor(
    public authService: AuthService,
    private router: Router,
    private companyInvitationService: CompanyInvitationService,
    public sharedService: SharedService,
    private suggestProductService: SuggestProductService
  ) {}


  showAuthModelIfNoAuthUser(): boolean {
    if (!this.authService.getCurrentUser) {
      this.showAuthModal = true;
      return true;
    }
    return false;
  }

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

  suggestProductOpenMethod(){
    if (this.showAuthModelIfNoAuthUser()) {
      return;
    }
    this.suggestProductOpen = true;
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

  confirmLogout(): void {
    this.logoutConfirmOpen = false;
    this.authService.logout();
    this.router.navigate(['/']);
  }

  suggestProductOpen = false;
  suggestionSuccess = false;

  suggestion = {
    name: '',
    companyName: '',
    description: ''
  };


  submitSuggestion(){

    if (this.showAuthModelIfNoAuthUser()) {
      return;
    }


    this.suggestProductService
      .createSuggestion(this.suggestion)
      .subscribe({

        next:()=>{

          // close modal
          this.suggestProductOpen = false;


          // reset form
          this.suggestion = {
            name:'',
            companyName:'',
            description:''
          };


          // show success message
          this.suggestionSuccess = true;


          // hide after 3 seconds
          setTimeout(() => {
            this.suggestionSuccess = false;
          }, 3000);

        },


        error:()=>{

          // optional later
          // show error toast

        }

      });

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
