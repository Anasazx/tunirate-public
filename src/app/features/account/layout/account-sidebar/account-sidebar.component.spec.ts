import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountSidebarComponent } from './account-sidebar.component';

describe('AccountSidebarComponent', () => {
  let component: AccountSidebarComponent;
  let fixture: ComponentFixture<AccountSidebarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccountSidebarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccountSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
