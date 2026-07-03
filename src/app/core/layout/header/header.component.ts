import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../features/auth/services/authService/auth.service';
import { CategoryService } from '../../../features/home/services/categoryService/category.service';
import { SubcategoryService } from '../../../features/home/services/subcategoryService/subcategory.service';
import { SearchService } from '../../services/searchService/search.service';
import { CompanyInvitationService } from '../../../features/company/services/companyInvitationService/company-invitation.service';
import { SharedService } from '../../services/sharedService/shared.service';
import { NavbarComponent } from '../navbar/navbar.component';


@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, NavbarComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {

  @Output() searchChange = new EventEmitter<string>();

  searchQuery = '';

  //TODO; MAKE THIS AN INDEPENDENT DTO TO REUSE IT!
  suggestions: {
    id: number;
    name: string;
    type: 'PRODUCT' | 'COMPANY';
    logoUrl?: string;
    verified?: boolean;
  }[] = [];

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

  ngOnInit(): void {
    this.loadInvitations();
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
  }

  /* ---------------- SEARCH ---------------- */

  onSearch(): void {
    const query = this.searchQuery.trim();
    this.searchChange.emit(query);

    if (!query) {
      this.suggestions = [];
      return;
    }

    this.searchService.search(query).subscribe({
      next: (res) => {
        const products = (res.products || []).map(product => ({
          id: product.id,
          name: product.name,
          type: 'PRODUCT' as const,
          logoUrl: product.imageUrl,
          verified: false
        }));

        const companies = (res.companies || []).map(company => ({
          id: company.id,
          name: company.name,
          type: 'COMPANY' as const,
          logoUrl: company.logoUrl,
          status: company.status ?? false
        }));

        this.suggestions = [...products, ...companies]
          .filter((item, index, arr) =>
            index === arr.findIndex(x => x.id === item.id && x.type === item.type)
          )
          .slice(0, 6);
      },
      error: () => {
        this.suggestions = [];
      }
    });
  }

  selectSuggestion(item: any): void {
    this.searchQuery = item.name;
    this.suggestions = [];
    this.searchChange.emit(item.name);

    this.router.navigate(
      item.type === 'COMPANY'
        ? ['/company', item.id]
        : ['/product', item.id]
    );
  }

  /* ---------------- INVITATIONS ---------------- */

  toggleInvitations(): void {
    this.showInvitations = !this.showInvitations;
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
}
