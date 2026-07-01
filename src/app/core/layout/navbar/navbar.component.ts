import { Component, OnInit } from '@angular/core';
import { NgForOf, NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CategoryService } from '../../../features/home/services/categoryService/category.service';
import { SubcategoryService } from '../../../features/home/services/subcategoryService/subcategory.service';

type HeaderCategory = any;

@Component({
  selector: 'app-navbar',
  imports: [NgForOf, NgIf, RouterLink],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})


export class NavbarComponent implements OnInit {

  categories: HeaderCategory[] = [];
  selectedCategoryId: number | null = null;
  currentRoute = '';

  constructor(
    private categoryService: CategoryService,
    private subcategoryService: SubcategoryService
  ) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  toggleCategory(categoryId: number): void {
    this.selectedCategoryId =
      this.selectedCategoryId === categoryId ? null : categoryId;
  }

  clearSelection(): void {
    this.selectedCategoryId = null;
  }

  activeCategory(): HeaderCategory | undefined {
    return this.categories.find(c => c.id === this.selectedCategoryId);
  }

  loadCategories(): void {
    this.categoryService.getAllCategories().subscribe({
      next: (categories) => {
        this.subcategoryService.getAllSubcategories().subscribe({
          next: (subcategories) => {
            this.categories = (categories ?? []).map(category => ({
              ...category,
              subcategories: (subcategories ?? [])
                .filter(s => s.categoryId === category.id)
                .map(s => ({ id: s.id, name: s.name }))
            }));
          },
          error: () => { this.categories = []; }
        });
      },
      error: () => { this.categories = []; }
    });
  }
}
