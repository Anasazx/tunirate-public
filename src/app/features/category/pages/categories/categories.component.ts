import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SubcategoryResponse } from '../../../../core/models/dto/subcategoryDTO/subcategoryResponse.model';
import { SUBCATEGORY_ICONS } from '../../../../core/constants/subcategory-icons';
import { SubcategoryService } from '../../../home/services/subcategoryService/subcategory.service';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.css'
})
export class CategoriesComponent implements OnInit {

  constructor(
    private subcategoryService: SubcategoryService,
    private router: Router
  ) {}

  subcategories: SubcategoryResponse[] = [];
  loading = true;

  protected readonly SUBCATEGORY_ICONS = SUBCATEGORY_ICONS;

  ngOnInit(): void {
    this.getSubcategories();
  }

  getSubcategories(): void {
    this.subcategoryService.getAllSubcategories().subscribe({
      next: (response) => {
        this.subcategories = response;
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to load subcategories:', err);
        this.loading = false;
      }
    });
  }

  goToCategory(subcategory: SubcategoryResponse): void {
    this.router.navigate(['/products'], {
      queryParams: {
        subcategoryId: subcategory.id,
        subcategory: subcategory.name
      }
    });
  }
}
