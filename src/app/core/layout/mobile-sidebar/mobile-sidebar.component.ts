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

}
