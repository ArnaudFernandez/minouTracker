import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {Intakes} from "../../class/intakes";
import {ServiceIntakeService} from "../../service-intake.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {SnackbarComponent} from "../../shared/snackbar/snackbar.component";

@Component({
  selector: 'app-intakes-history',
  templateUrl: './intakes-history.component.html',
  styleUrls: ['./intakes-history.component.scss']
})
export class IntakesHistoryComponent implements OnInit {

  @Input()
  currentIntakes : Intakes[] = [];

  totalIntakes = 0;

  constructor(public serviceIntake: ServiceIntakeService,
              private _snackBar: MatSnackBar) { }

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

  removeIntake(intake: Intakes): void {
    this.serviceIntake.deleteIntake(intake.eventId as string);
    this.confirmDelete(intake);
  }

  private confirmDelete(intake: Intakes) {
    this._snackBar.openFromComponent(SnackbarComponent, {
      duration: 5 * 1000,
      data: {
        text: '⛔ ' + intake.titleIntake + ' supprimé --> ' + intake.intakeValue + ' cal. retirés du total journalier.'
      }
    });
  }

}
