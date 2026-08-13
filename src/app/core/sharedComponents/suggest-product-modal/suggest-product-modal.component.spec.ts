import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuggestProductModalComponent } from './suggest-product-modal.component';

describe('SuggestProductModalComponent', () => {
  let component: SuggestProductModalComponent;
  let fixture: ComponentFixture<SuggestProductModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SuggestProductModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SuggestProductModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
