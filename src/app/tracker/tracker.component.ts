import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {ServiceIntakeService} from "../service-intake.service";
import {Intakes} from "../class/intakes";
import {interval, Observable, Subscription} from "rxjs";
import {User} from '../class/user';

@Component({
  templateUrl: './tracker.component.html',
  styleUrls: ['./tracker.component.scss']
})
export class TrackerComponent implements OnInit {

  selectedPerson?: User = undefined;
  lastPersonSelected?: string = undefined;

  /** Value for progress spinner */
  currentIntakeValue = 1200;
  maxIntakeForTheDay = 1300;
  spinnerDiameter = 250;

  /** Database items & selectors */
  items: unknown[] = [];
  itemForSelectedUser: { nickname: string, currentIntake: string, targetIntake: string | number } = {
    nickname: '',
    currentIntake: '',
    targetIntake: ''
  };
  selectedUserIntakes: Intakes[] = [];
  serviceIntake: ServiceIntakeService;

  // Emoji animation
  sportiveSmileyAnimation: string[] = ['🥵', '🤙', '🥗', '🍆', '🍌', '🍅', '🚀', '🏆', '🥇', '🚿', '🍳', '🏃', '🤸'];
  indexRandomIcon = 0;
  emojiSubscription: Subscription = new Subscription();

  /** FormGroup intake */
  intakeFormGroup: FormGroup = new FormGroup({
    titleIntake: new FormControl('', Validators.minLength(1)),
    intakeValue: new FormControl('', Validators.min(1))
  })

  /** FormGroup setup target intake */
  targetIntakeSetupFormGroup: FormGroup = new FormGroup({
    targetIntake: new FormControl('', Validators.minLength(1))
  })

  constructor(db: AngularFirestore, serviceIntake: ServiceIntakeService) {
    this.serviceIntake = serviceIntake;
    this.serviceIntake.getAllIntakesDocuments()?.subscribe(v => {
      this.items = v as unknown[];
    });
    this.serviceIntake.getPersonConnectedInfos()?.subscribe(v => {
      if (v.length > 0) {
        this.selectedPerson = v[0];
      } else {
        this.selectedPerson = {displayName: '', targetIntake: 0}
      }
    })
  }

  ngOnInit(): void {
    this.intakeFormGroup.reset({
      titleIntake: '',
      intakeValue: undefined
    });

    const emojiLoop = interval(2000);
    this.emojiSubscription = emojiLoop.subscribe(_ => {
      this.indexRandomIcon = Math.trunc((Math.random() * (this.sportiveSmileyAnimation.length - 1) + 1) - 1);
    });

    this.setIntakesFromSelectedUser();
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
    this.targetIntakeSetupFormGroup.reset({
      targetIntake: undefined
    });
  }

  getSpinnerProgressValue(): number {
    if (this.selectedPerson) {
      return (this.getTotalCurrentIntakesFromSelectedUser() / (this.selectedPerson?.targetIntake as number) * 100)
    }
    return 0;
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
      this.resetAllForm();
    }
  }

  ajouterObjectif(): void {
    if (this.targetIntakeSetupFormGroup.value.targetIntake) {
      this.serviceIntake.addTargetIntake(this.targetIntakeSetupFormGroup.value.targetIntake);
      this.setItemsForSelectedUser();
      this.resetAllForm()
    }
  }


  getTotalCurrentIntakesFromSelectedUser(): number {
    let total = 0;
    this.selectedUserIntakes.forEach(intake => {
      total += intake.intakeValue;
    });
    return total;
  }

  getSelectedPerson(): User {
    const jsonPerson = JSON.parse(localStorage.getItem('user') as string);
    if (jsonPerson) {
      return jsonPerson as User;
    }
    return {};
  }

  getTargetIntakeOfSelectedUser(): number {
    if (this.selectedPerson?.targetIntake) {
      return (this.selectedPerson.targetIntake as number);
    }
    return 0;
  }

  isUserLoggedAndWithoutTargetIntake(): boolean {
    if (!this.selectedPerson) {
      return false;
    }
    if (this.selectedPerson.targetIntake === undefined || this.selectedPerson.targetIntake <= 0) {
      return true;
    }
    return false;
  }

  private getSmileyAnimation(): string {
    return this.sportiveSmileyAnimation[this.indexRandomIcon];
  }

  getCurrentSmiley(): string {
    return this.getSmileyAnimation();
  }

  private setIntakesFromSelectedUser(): void {
    (this.serviceIntake.getAllIntakesDocuments() as Observable<Intakes[]>).subscribe(value => {
      this.selectedUserIntakes = [];
      value.forEach(intakeDoc => {
        intakeDoc.dateFormatted = intakeDoc.date.toDate();
        // @ts-ignore
        if (intakeDoc.dateFormatted.getDate() === new Date().getDate()
          && intakeDoc.dateFormatted.getMonth() === new Date().getMonth()
          && intakeDoc.dateFormatted.getFullYear() === new Date().getFullYear()
        ) {
          this.selectedUserIntakes.push(intakeDoc);
        }
      })
    })
  }

  private setItemsForSelectedUser(): void {
    this.items.forEach(item => {
      // @ts-ignore
      if (item.nickname === this.selectedPerson) {
        // @ts-ignore
        this.itemForSelectedUser = item;
      }
    })
    this.setIntakesFromSelectedUser();
  }

}
