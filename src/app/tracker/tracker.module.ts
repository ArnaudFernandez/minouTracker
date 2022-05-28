import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule} from '@angular/router';
import {TrackerComponent} from './tracker.component';
import {IntakesHistoryComponent} from './intakes-history/intakes-history.component';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatChipsModule} from '@angular/material/chips';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {BrowserModule} from '@angular/platform-browser';
import {HttpClientModule} from '@angular/common/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {AuthGuard} from '../shared/guard/auth.guard';
import { TeamTrackerComponent } from './team-tracker/team-tracker.component';
import {MatCardModule} from "@angular/material/card";
import { TeamTrackerProgressComponent } from './team-tracker/team-tracker-progress/team-tracker-progress.component';
import {MatProgressBarModule} from "@angular/material/progress-bar";

@NgModule({
  declarations: [
    TrackerComponent,
    IntakesHistoryComponent,
    TeamTrackerComponent,
    TeamTrackerProgressComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {path: 'tracker', component: TrackerComponent, canActivate: [AuthGuard]},
      {path: 'teamTracking', component: TeamTrackerComponent, canActivate: [AuthGuard]},
      {path: 'teamTracking/:id', component: TeamTrackerProgressComponent, canActivate: [AuthGuard]}
    ]),
    MatProgressSpinnerModule,
    MatFormFieldModule,
    MatIconModule,
    MatChipsModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatInputModule,
    MatIconModule,
    MatCardModule,
    MatProgressBarModule,
  ]
})
export class TrackerModule { }
