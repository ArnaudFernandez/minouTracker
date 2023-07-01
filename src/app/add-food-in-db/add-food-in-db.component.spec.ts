import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddFoodInDBComponent } from './add-food-in-db.component';

describe('AddFoodInDBComponent', () => {
  let component: AddFoodInDBComponent;
  let fixture: ComponentFixture<AddFoodInDBComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddFoodInDBComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddFoodInDBComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
