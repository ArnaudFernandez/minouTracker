import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {Intakes} from "../../class/intakes";

@Component({
  selector: 'app-intakes-history',
  templateUrl: './intakes-history.component.html',
  styleUrls: ['./intakes-history.component.scss']
})
export class IntakesHistoryComponent implements OnInit {

  @Input()
  currentIntakes : Intakes[] = [];

  totalIntakes = 0;

  constructor() { }

  ngOnInit(): void {
  }

  calculateTotalCalories(): number {
    this.totalIntakes = 0;
    if (this.currentIntakes.length > 0) {
      this.currentIntakes.forEach(intake => {
        this.totalIntakes += intake.intakeValue;
      })
    }
    return this.totalIntakes;
  }

}
