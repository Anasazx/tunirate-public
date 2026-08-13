import {Component, ElementRef, HostListener, Input} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgForOf, NgIf } from '@angular/common';
import { Router } from '@angular/router';
import { Subject, debounceTime, distinctUntilChanged, switchMap, of, catchError } from 'rxjs';

import { SearchService } from '../../services/searchService/search.service';
import { ImageUrlPipe } from '../../pipes/image-url.pipe';
import { SearchSuggestion } from '../../models/dto/searchDTO/searchSuggestion.model';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [
    FormsModule,
    NgIf,
    NgForOf,
    ImageUrlPipe,
  ],
  templateUrl: './search-bar.component.html',
  styleUrl: './search-bar.component.css'
})
export class SearchBarComponent {


  @Input() variant: 'header' | 'hero' | 'mobile' = 'header';

  searchQuery = '';
  suggestions: SearchSuggestion[] = [];

  private searchSubject = new Subject<string>();

  constructor(
    private router: Router,
    private searchService: SearchService,
    private elementRef: ElementRef
  ) {

    this.searchSubject.pipe(
      debounceTime(250),
      distinctUntilChanged(),

      switchMap(query => {

        if (!query) {
          return of([]);
        }

        return this.searchService.searchSuggestions(query).pipe(
          catchError(() => of([]))
        );
      })

    ).subscribe(suggestions => {
      this.suggestions = suggestions.slice(0, 6);
    });
  }

  /**
   * Called whenever the user types.
   */
  onInput(): void {

    const query = this.searchQuery.trim();

    if (!query) {
      this.suggestions = [];
      return;
    }

    this.searchSubject.next(query);
  }

  /**
   * Normal search.
   */
  goToSearch(): void {

    const query = this.searchQuery.trim();

    if (!query) {
      this.suggestions = [];
      return;
    }

    this.suggestions = [];

    this.router.navigate(
      ['/search'],
      {
        queryParams: {
          q: query
        }
      }
    );
  }

  /**
   * User clicked an autocomplete suggestion.
   */
  selectSuggestion(item: SearchSuggestion): void {

    this.searchQuery = item.name;
    this.suggestions = [];

    if (item.type === 'COMPANY') {

      this.router.navigate(['/c', item.id]);

    } else {

      this.router.navigate(['/p', item.id]);

    }
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const clickedInside = this.elementRef.nativeElement.contains(event.target);
    if (!clickedInside) {
      this.suggestions = [];
    }
  }


}
