import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyCommentsComponent } from './my-comments.component';

describe('MyCommentsComponent', () => {
  let component: MyCommentsComponent;
  let fixture: ComponentFixture<MyCommentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyCommentsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyCommentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
