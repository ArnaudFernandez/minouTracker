import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamTrackerProgressComponent } from './team-tracker-progress.component';

describe('TeamTrackerProgressComponent', () => {
  let component: TeamTrackerProgressComponent;
  let fixture: ComponentFixture<TeamTrackerProgressComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TeamTrackerProgressComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TeamTrackerProgressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
