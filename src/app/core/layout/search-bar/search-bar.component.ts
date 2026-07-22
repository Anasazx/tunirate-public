import {Component, EventEmitter, Output} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {NgForOf, NgIf} from "@angular/common";
import {Router} from '@angular/router';
import {SearchService} from '../../services/searchService/search.service';
import {SharedService} from '../../services/sharedService/shared.service';
import {ImageUrlPipe} from '../../pipes/image-url.pipe';

@Component({
  selector: 'app-search-bar',
  imports: [
    FormsModule,
    NgForOf,
    NgIf,
    ImageUrlPipe
  ],
  templateUrl: './search-bar.component.html',
  styleUrl: './search-bar.component.css'
})
export class SearchBarComponent {

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

  constructor(
    private router: Router,
    private searchService: SearchService,
    public sharedService: SharedService,
  ) {}

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
          logoUrl: product.imageUrl?.url,
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

}
