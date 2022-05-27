import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule} from '@angular/router';
import { HistoryComponent } from './history.component';



@NgModule({
  declarations: [
    HistoryComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {path: 'history', component: HistoryComponent}
    ])
  ]
})
export class HistoryModule { }
