import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {ServiceIntakeService} from "../service-intake.service";
import {Intakes} from "../class/intakes";
import firebase from "firebase/compat/app";
import Timestamp = firebase.firestore.Timestamp;
import {sanitizeIdentifier} from "@angular/compiler";
import {interval, Subscription} from "rxjs";

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit, OnChanges {

  @Input()
  selectedPerson?: string = undefined;
  lastPersonSelected?: string = undefined;

  /** Value for progress spinner */
  currentIntakeValue = 1200;
  maxIntakeForTheDay = 1300;
  spinnerDiameter = 250;

  /** Database items & selectors */
  items: unknown[] = [];
  itemForSelectedUser: {nickname: string, currentIntake: string, targetIntake: string | number} = {
    nickname: '',
    currentIntake: '',
    targetIntake: ''
  };
  selectedUserIntakes: Intakes[] = [];
  serviceIntake : ServiceIntakeService;

  // Emoji animation
  sportiveSmileyAnimation : string[] = ['🥵', '🤙', '🥗', '🍆', '🍌', '🍅', '🚀', '🏆', '🥇', '🚿', '🍳', '🏃', '🤸'];
  indexRandomIcon = 0;
  emojiSubscription: Subscription = new Subscription();

  //
  /** FormGroup intake */
  intakeFormGroup: FormGroup = new FormGroup({
    titleIntake: new FormControl('', Validators.minLength(1)),
    intakeValue: new FormControl('', Validators.min(1))
  })

  constructor(db: AngularFirestore, serviceIntake: ServiceIntakeService) {
    this.serviceIntake = serviceIntake;
     db.collection('person').valueChanges().subscribe( v => {
       this.items = v as unknown[];
    });
  }

  ngOnInit(): void {
    this.intakeFormGroup.reset({
      titleIntake: '',
      intakeValue: undefined
    });

    const emojiLoop = interval(2000);
    this.emojiSubscription = emojiLoop.subscribe( _ => {
      this.indexRandomIcon = Math.trunc((Math.random() * (this.sportiveSmileyAnimation.length - 1) + 1) - 1);
    })
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.lastPersonSelected === undefined || this.lastPersonSelected !== this.selectedPerson) {
      this.lastPersonSelected = this.selectedPerson;
      this.setItemsForSelectedUser();
    }
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
    return (this.getTotalCurrentIntakesFromSelectedUser() / (this.itemForSelectedUser.targetIntake as number) * 100)
  }

  getColorStateOfSpinner(): 'primary' | 'warn' {
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
    return this.getTotalCurrentIntakesFromSelectedUser() > this.maxIntakeForTheDay;
  }

  ajouterApport(): void {
    if (this.intakeFormGroup.value.intakeValue && this.intakeFormGroup.value.titleIntake) {
      this.serviceIntake.addIntakes(this.itemForSelectedUser.nickname, this.intakeFormGroup.value.intakeValue, this.intakeFormGroup.value.titleIntake);
      this.setItemsForSelectedUser();
      this.resetAllForm()
    }
  }

  goToLaura(): void {
    this.selectedPerson = 'Laura';
    this.setItemsForSelectedUser();
  }

  goToArnaud(): void {
    this.selectedPerson = 'Arnaud';
    this.setItemsForSelectedUser();
  }

  getTotalCurrentIntakesFromSelectedUser(): number {
    let total = 0;
    this.selectedUserIntakes.forEach(intake => {
      total += intake.intakeValue;
    });
    return total;
  }

  private getSmileyAnimation(): string {
    return this.sportiveSmileyAnimation[this.indexRandomIcon];
  }

  getCurrentSmiley(): string {
    return this.getSmileyAnimation();
  }

  private setIntakesFromSelectedUser(): void {
    this.serviceIntake.getAllIntakesDocuments().subscribe( value => {
      this.selectedUserIntakes = [];
      value.forEach(intakeDoc => {
        intakeDoc.dateFormatted = intakeDoc.date.toDate();
        // @ts-ignore
        if (intakeDoc.nickname === this.selectedPerson
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
      if (item.nickname === this.selectedPerson) {
        // @ts-ignore
        this.itemForSelectedUser = item;
      }
    })
    this.setIntakesFromSelectedUser();
  }

}
