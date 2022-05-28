import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamTrackerComponent } from './team-tracker.component';

describe('TeamTrackerComponent', () => {
  let component: TeamTrackerComponent;
  let fixture: ComponentFixture<TeamTrackerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TeamTrackerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TeamTrackerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
