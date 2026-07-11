import { Component, OnInit } from '@angular/core';
import { NgForOf, NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CategoryService } from '../../../features/home/services/categoryService/category.service';
import { SubcategoryService } from '../../../features/home/services/subcategoryService/subcategory.service';
import { trigger, transition, style, animate } from '@angular/animations';

type HeaderCategory = any;

@Component({
  selector: 'app-navbar',
  imports: [NgForOf, NgIf, RouterLink],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
  animations: [
    trigger('subCategoryAnimation', [
      transition(':enter', [
        style({
          opacity: 0,
          transform: 'translateY(-10px)'
        }),
        animate(
          '200ms ease-out',
          style({
            opacity: 1,
            transform: 'translateY(0)'
          })
        )
      ]),
      transition(':leave', [
        animate(
          '150ms ease-in',
          style({
            opacity: 0,
            transform: 'translateY(-10px)'
          })
        )
      ])
    ])
  ]
})


export class NavbarComponent implements OnInit {

  categories: HeaderCategory[] = [];
  selectedCategoryId: number | null = null;

  constructor(
    private categoryService: CategoryService,
    private subcategoryService: SubcategoryService
  ) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  hoveredCategoryId: number | null = null;

  hideTimeout: any;

  showSubcategories(categoryId: number) {
    clearTimeout(this.hideTimeout);
    this.hoveredCategoryId = categoryId;
  }

  hideSubcategories() {
    this.hideTimeout = setTimeout(() => {
      this.hoveredCategoryId = null;
    }, 200);
  }

  activeCategory() {
    return this.categories.find(
      c => c.id === this.hoveredCategoryId
    );
  }

  clearSelection(): void {
    this.selectedCategoryId = null;
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
