import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductImageGalleryComponent } from './product-image-gallery.component';

describe('ProductImageGalleryComponent', () => {
  let component: ProductImageGalleryComponent;
  let fixture: ComponentFixture<ProductImageGalleryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductImageGalleryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductImageGalleryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
