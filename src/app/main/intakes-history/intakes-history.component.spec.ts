import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IntakesHistoryComponent } from './intakes-history.component';

describe('IntakesHistoryComponent', () => {
  let component: IntakesHistoryComponent;
  let fixture: ComponentFixture<IntakesHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IntakesHistoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IntakesHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
