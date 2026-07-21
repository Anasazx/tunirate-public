import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MySuggestionsComponent } from './my-suggestions.component';

describe('MySuggestionsComponent', () => {
  let component: MySuggestionsComponent;
  let fixture: ComponentFixture<MySuggestionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MySuggestionsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MySuggestionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
