import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductRatingOverviewComponent } from './product-rating-overview.component';

describe('ProductRatingOverviewComponent', () => {
  let component: ProductRatingOverviewComponent;
  let fixture: ComponentFixture<ProductRatingOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductRatingOverviewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductRatingOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
