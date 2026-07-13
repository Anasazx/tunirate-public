import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthRequiredComponent } from './auth-required.component';

describe('AuthRequiredComponent', () => {
  let component: AuthRequiredComponent;
  let fixture: ComponentFixture<AuthRequiredComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuthRequiredComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuthRequiredComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
