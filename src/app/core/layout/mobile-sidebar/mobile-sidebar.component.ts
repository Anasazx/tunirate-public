import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoryService } from '../../../features/home/services/categoryService/category.service';
import { SubcategoryService } from '../../../features/home/services/subcategoryService/subcategory.service';
import {ActivatedRoute, RouterLink} from '@angular/router';

type SidebarCategory = any;

@Component({
  selector: 'app-mobile-sidebar',
  imports: [CommonModule, RouterLink],
  templateUrl: './mobile-sidebar.component.html',
  styleUrl: './mobile-sidebar.component.css'
})
export class MobileSidebarComponent implements OnInit {

  @Input() open = false;
  @Output() close = new EventEmitter<void>();

  categories: SidebarCategory[] = [];

  currentCategory: string | null = null;
  currentSubcategory: string | null = null;

  expandedCategories = new Set<number>();

  constructor(
    private categoryService: CategoryService,
    private subcategoryService: SubcategoryService,
    private route: ActivatedRoute
  ){}


  ngOnInit(): void {
    this.loadCategories();

    this.route.queryParamMap.subscribe(params => {
      this.currentCategory = params.get('category');
      this.currentSubcategory = params.get('subcategory');
    });

  }

/*
  loadCategories(): void {

    this.categoryService.getAllCategories()
      .subscribe({

        next: (categories) => {

          this.subcategoryService.getAllSubcategories()
            .subscribe({

              next: (subcategories) => {

                this.categories = (categories ?? [])
                  .map(category => ({

                    ...category,

                    subcategories: (subcategories ?? [])
                      .filter(
                        sub => sub.categoryId === category.id
                      )
                      .map(sub => ({
                        id: sub.id,
                        name: sub.name
                      }))

                  }));

              },

              error: () => {
                this.categories = [];
              }

            });

        },

        error: () => {
          this.categories = [];
        }

      });

  }

 */

  toggleSubcategories(categoryId: number) {
    if (this.expandedCategories.has(categoryId)) {
      this.expandedCategories.delete(categoryId);
    } else {
      this.expandedCategories.add(categoryId);
    }
  }

  isExpanded(categoryId: number): boolean {
    return this.expandedCategories.has(categoryId);
  }

  beautyCategory: SidebarCategory | null = null;

  beautySubcategories: { id: number; name: string }[] = [];

  loadCategories(): void {

    this.categoryService.getAllCategories()
      .subscribe({

        next: (categories) => {

          this.subcategoryService.getAllSubcategories()
            .subscribe({

              next: (subcategories) => {


                this.categories = (categories ?? [])
                  .map(category => ({

                    ...category,

                    subcategories: (subcategories ?? [])
                      .filter(
                        sub => sub.categoryId === category.id
                      )
                      .map(sub => ({
                        id: sub.id,
                        name: sub.name
                      }))

                  }));


                // Find Beauty
                this.beautyCategory = this.categories.find(
                  c => c.name.toLowerCase() === 'beauty'
                ) ?? null;


                // Get Beauty subcategories
                this.beautySubcategories =
                  this.beautyCategory?.subcategories ?? [];


              },

              error: () => {
                this.categories = [];
                this.beautyCategory = null;
                this.beautySubcategories = [];
              }

            });

        },

        error: () => {
          this.categories = [];
          this.beautyCategory = null;
          this.beautySubcategories = [];
        }

      });

  }

}
