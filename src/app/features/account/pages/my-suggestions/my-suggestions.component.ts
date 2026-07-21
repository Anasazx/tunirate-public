import { Component } from '@angular/core';
import { SuggestProductService } from '../../../../core/services/suggestProductService/suggest-product.service';
import { ProductSuggestionResponse } from '../../../../core/models/dto/ProductSuggestionDTO/ProductSuggestionResponse.model';
import { CommonModule, DatePipe, NgClass } from '@angular/common';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-my-suggestions',
  imports: [
    DatePipe,
    NgClass,
    CommonModule,
    RouterLink
  ],
  templateUrl: './my-suggestions.component.html',
  styleUrl: './my-suggestions.component.css'
})
export class MySuggestionsComponent {

  suggestions: ProductSuggestionResponse[] = [];

  loading = true;

  constructor(
    private suggestProductService: SuggestProductService
  ) {}

  ngOnInit(): void {
    this.loadSuggestions();
  }

  loadSuggestions(): void {
    this.loading = true;
    this.suggestProductService.getMySuggestions().subscribe({
      next: (data) => {
        this.suggestions = data;
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
      }
    });
  }

}
