import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {ServiceIntakeService} from "../service-intake.service";
import {Intakes} from "../class/intakes";
import firebase from "firebase/compat/app";
import Timestamp = firebase.firestore.Timestamp;

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  /** Value for progress spinner */
  currentIntakeValue = 1200;
  maxIntakeForTheDay = 1300;
  spinnerDiameter = 250;

  /** Database items & selectors */
  items: unknown[] = [];
  itemForSelectedUser: {nickname: string, currentIntake: string, targetIntake: string } = {
    nickname: '',
    currentIntake: '',
    targetIntake: ''
  };
  selectedUserToDisplay = '';
  selectedUserIntakes: Intakes[] = [];
  serviceIntake : ServiceIntakeService;

  /** FormGroup intake */
  intakeFormGroup: FormGroup = new FormGroup({
    titleIntake: new FormControl('', Validators.minLength(1)),
    intakeValue: new FormControl('', Validators.min(1))
  })

  constructor(db: AngularFirestore, serviceIntake: ServiceIntakeService) {
    this.serviceIntake = serviceIntake;
     db.collection('person').valueChanges().subscribe( v => {
       this.items = v as unknown[];
       console.log(this.items)
    });
  }

  ngOnInit(): void {
    this.intakeFormGroup.reset({
      titleIntake: '',
      intakeValue: undefined
    });

  }

  resetTitleIntake(): void {
    this.intakeFormGroup.reset({
      ...this.intakeFormGroup.value,
      titleIntake: ''
    });
  }

  resetIntakeValue(): void {
    this.intakeFormGroup.reset({
      ...this.intakeFormGroup.value,
      intakeValue: undefined
    });
  }

  resetAllForm(): void {
    this.intakeFormGroup.reset({
      titleIntake: '',
      intakeValue: undefined
    });
  }

  getSpinnerProgressValue(): number {
    return (this.getTotalCurrentIntakesFromSelectedUser() / this.maxIntakeForTheDay * 100)
  }

  getColorStateOfSpinner(): string {
    if (!this.isOverMaxIntake()) {
      return 'primary';
    }
    return 'warn';
  }

  getSpinnerTextStyle(): {} {
    return {
      // 26 = fontSize
      'margin-top': '-' + (this.spinnerDiameter / 2 + 16) + 'px',
      // And then repushing stuff the same amount of pixels
      'padding-bottom': (this.spinnerDiameter / 2 + 26) + 'px'
    };
  }

  isOverMaxIntake(): boolean {
    return this.currentIntakeValue > this.maxIntakeForTheDay;
  }

  ajouterApport(): void {
    if (this.intakeFormGroup.value.intakeValue && this.intakeFormGroup.value.titleIntake) {
      this.serviceIntake.addIntakes(this.itemForSelectedUser.nickname, this.intakeFormGroup.value.intakeValue, this.intakeFormGroup.value.titleIntake);
      this.setItemsForSelectedUser();
      this.resetAllForm()
    }
  }

  goToLaura(): void {
    this.selectedUserToDisplay = 'Laura';
    this.setItemsForSelectedUser();
  }

  goToArnaud(): void {
    this.selectedUserToDisplay = 'Arnaud';
    this.setItemsForSelectedUser();
  }

  getTotalCurrentIntakesFromSelectedUser(): number {
    let total = 0;
    this.selectedUserIntakes.forEach(intake => {
      total += intake.intakeValue;
    });
    return total;
  }

  private setIntakesFromSelectedUser(): void {
    this.serviceIntake.getAllIntakesDocuments().subscribe( value => {
      this.selectedUserIntakes = [];
      value.forEach(intakeDoc => {
        intakeDoc.dateFormatted = intakeDoc.date.toDate();
        // @ts-ignore
        if (intakeDoc.nickname === this.selectedUserToDisplay
          && intakeDoc.dateFormatted.getDate() === new Date().getDate()
          && intakeDoc.dateFormatted.getMonth() === new Date().getMonth()
          && intakeDoc.dateFormatted.getFullYear() === new Date().getFullYear()
        ) {
          this.selectedUserIntakes.push(intakeDoc);
        }
      })
    })
  }

  private setItemsForSelectedUser(): void {
    this.items.forEach( item => {
      // @ts-ignore
      if (item.nickname === this.selectedUserToDisplay) {
        // @ts-ignore
        this.itemForSelectedUser = item;
      }
    })
    this.setIntakesFromSelectedUser();
  }

}
