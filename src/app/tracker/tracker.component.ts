import {AfterViewInit, Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {ServiceIntakeService} from "../service-intake.service";
import {Intakes} from "../class/intakes";
import {interval, Observable, Subscription} from "rxjs";
import {User} from '../class/user';
import {MatSnackBar} from "@angular/material/snack-bar";
import {SnackbarComponent} from "../shared/snackbar/snackbar.component";
import {Router} from "@angular/router";
import {Food} from "../class/food";
import {MatDialog} from "@angular/material/dialog";
import {AddFoodInDBComponent} from "../add-food-in-db/add-food-in-db.component";

@Component({
  templateUrl: './tracker.component.html',
  styleUrls: ['./tracker.component.scss']
})
export class TrackerComponent implements OnInit, AfterViewInit {

  selectedPerson?: User = undefined;
  lastPersonSelected?: string = undefined;

  /** Change view by clicking or tapping intake or macros */
  isInIntakeView: boolean = true;

  /** Value for progress spinner */
  currentIntakeValue = 1200;
  maxIntakeForTheDay = 1300;
  spinnerDiameter = 0;

  /** Database items & selectors */
  items: unknown[] = [];
  itemForSelectedUser: { nickname: string, currentIntake: string, targetIntake: string | number } = {
    nickname: '',
    currentIntake: '',
    targetIntake: ''
  };
  selectedUserIntakes: Intakes[] = [];
  serviceIntake: ServiceIntakeService;

  foods: [{ viewValue: string, food: Food }] = [{
    viewValue: '',
    food: new Food('', 0, 0, 0, 0, 0, '0')
  }];

  // Emoji animation
  sportiveSmileyAnimation: string[] = ['🥵', '🤙', '🥗', '🍆', '🍌', '🍅', '🚀', '🏆', '🥇', '🚿', '🍳', '🏃', '🤸'];
  indexRandomIcon = 0;
  emojiSubscription: Subscription = new Subscription();

  /** FormGroup intake */
  intakeFormGroup: FormGroup = new FormGroup({
    titleIntake: new FormControl('', Validators.minLength(1)),
    intakeValue: new FormControl('', Validators.min(1)),
    protein: new FormControl('', Validators.min(1)),
    carbohydrates: new FormControl('', Validators.min(1)),
    fat: new FormControl('', Validators.min(1))
  })

  /** FormGroup setup target intake */
  targetIntakeSetupFormGroup: FormGroup = new FormGroup({
    targetIntake: new FormControl('', Validators.minLength(1)),
    proteinTarget: new FormControl('', Validators.min(0)),
    carbohydratesTarget: new FormControl('', Validators.min(0)),
    fatTarget: new FormControl('', Validators.min(0))
  })

  /** FormGroup food selection */
  foodSelectionFormGroup: FormGroup = new FormGroup({
    weight: new FormControl('', Validators.minLength(1))
  })

  /** Selected value of food retrieved from database */
  selectedFood: Food | undefined = undefined;

  constructor(db: AngularFirestore,
              serviceIntake: ServiceIntakeService,
              private _snackbar: MatSnackBar,
              private router: Router,
              public dialog: MatDialog) {
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
      intakeValue: undefined,
      protein: undefined,
      carbohydrates: undefined,
      fat: undefined
    });

    this.indexRandomIcon = Math.trunc((Math.random() * (this.sportiveSmileyAnimation.length - 1) + 1) - 1);

    const emojiLoop = interval(2000);
    this.emojiSubscription = emojiLoop.subscribe(_ => {
      this.indexRandomIcon = Math.trunc((Math.random() * (this.sportiveSmileyAnimation.length - 1) + 1) - 1);
    });

    this.setIntakesFromSelectedUser();
    this.setFoodFromSelectedUser();
  }

  openPopupAddFood(): void {
    const dialogRef = this.dialog.open(AddFoodInDBComponent, {});

    dialogRef.afterClosed().subscribe(result => {
    });
  }

  adjustWeight(): void {
    this.foodSelectionFormGroup.reset();
    this.foodSelectionFormGroup.setValue({
      weight: this.selectedFood?.weight
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

  resetProteinValue(): void {
    this.intakeFormGroup.reset({
      ...this.intakeFormGroup.value,
      protein: undefined
    });
  }

  resetCarbohydratesValue(): void {
    this.intakeFormGroup.reset({
      ...this.intakeFormGroup.value,
      carbohydrates: undefined
    });
  }

  resetFatValue(): void {
    this.intakeFormGroup.reset({
      ...this.intakeFormGroup.value,
      fat: undefined
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
    this.foodSelectionFormGroup.reset({
      weight: undefined
    });
    this.selectedFood = undefined;
  }

  getCurrentProtein(): number {
    let totalProtein = 0;
    this.selectedUserIntakes.forEach(intake => {
      totalProtein += intake.protein;
    });
    return totalProtein;
  }

  getCurrentCarbohydrates(): number {
    let totalCarbohydrates = 0;
    this.selectedUserIntakes.forEach(intake => {
      totalCarbohydrates += intake.carbohydrates;
    });
    return totalCarbohydrates;
  }

  getCurrentFat(): number {
    let totalFat = 0;
    this.selectedUserIntakes.forEach(intake => {
      totalFat += intake.fat;
    });
    return totalFat;
  }

  getSpinnerProgressValue(): number {
    let totalIntake = this.getTotalCurrentIntakesFromSelectedUser();
    if (this.selectedPerson && (totalIntake / (this.selectedPerson?.targetIntake as number) * 100) < 100) {
      return (totalIntake / (this.selectedPerson?.targetIntake as number) * 100)
    } else {
      return 100;
    }
  }

  getColorStateOfSpinner(): 'primary' | 'warn' | 'accent' {
    if (!this.isOverMaxIntake()) {
      return 'primary';
    } else {
      return 'accent';
    }
  }

  getSpinnerTextStyle(): {} {
    return {
      // 26 = fontSize
      'margin-top': '-' + (this.spinnerDiameter / 2 + 16) + 'px',
      // And then repushing stuff the same amount of pixels
      'padding-bottom': (this.spinnerDiameter / 2 + 26) + 'px'
    };
  }

  getSpinnerTextStyleMacros(): {} {
    return {
      // 26 = fontSize
      'margin-top': '-' + (this.spinnerDiameter / 2 + 55) + 'px',
      // And then repushing stuff the same amount of pixels
      'padding-bottom': (this.spinnerDiameter / 2 - 15) + 'px'
    };
  }

  isOverMaxIntake(): boolean {
    return this.getTotalCurrentIntakesFromSelectedUser() > this.maxIntakeForTheDay;
  }

  ajouterApport(): void {
    if (this.intakeFormGroup.value.intakeValue
      && this.intakeFormGroup.value.titleIntake
      && this.intakeFormGroup.value.protein
      && this.intakeFormGroup.value.carbohydrates
      && this.intakeFormGroup.value.fat) {
      this.serviceIntake.addIntakes(this.itemForSelectedUser.nickname,
        this.intakeFormGroup.value.intakeValue,
        this.intakeFormGroup.value.titleIntake,
        this.intakeFormGroup.value.protein,
        this.intakeFormGroup.value.carbohydrates,
        this.intakeFormGroup.value.fat);
      this.setItemsForSelectedUser();
      this._snackbar.openFromComponent(SnackbarComponent, {
        duration: 5 * 1000,
        data: {
          text: '🍴 ' + this.intakeFormGroup.value.titleIntake + ' ajouté --> ' + this.intakeFormGroup.value.intakeValue + ' cal. ajoutés au total journalier.'
        }
      });
      this.resetAllForm();
    }
  }

  ajouterObjectif(): void {
    if (this.targetIntakeSetupFormGroup.value.targetIntake) {
      this.serviceIntake.addTargetIntake(this.targetIntakeSetupFormGroup.value.targetIntake,
        this.targetIntakeSetupFormGroup.value.proteinTarget,
        this.targetIntakeSetupFormGroup.value.carbohydratesTarget,
        this.targetIntakeSetupFormGroup.value.fatTarget);
      this.setItemsForSelectedUser();
      this.resetAllForm()
    }
  }

  ajouterAliment(): void {
    if (this.foodSelectionFormGroup.value) {
      this.serviceIntake.addIntakes(
        this.selectedFood?.foodName as string,
        this.weightChangeFactor(this.selectedFood?.calories) as number,
        this.selectedFood?.foodName as string,
        this.weightChangeFactor(this.selectedFood?.protein) as number,
        this.weightChangeFactor(this.selectedFood?.carbohydrates) as number,
        this.weightChangeFactor(this.selectedFood?.fat) as number);
      this.setItemsForSelectedUser();
      this._snackbar.openFromComponent(SnackbarComponent, {
        duration: 5 * 1000,
        data: {
          text: '🍴 ' + this.selectedFood?.foodName + ' ajouté --> ' + this.selectedFood?.calories + ' cal. ajoutés au total journalier.'
        }
      });
      this.resetAllForm();
    }
  }

  weightChangeFactor(number: number | undefined): number | undefined {
    if (number) {
      return parseFloat(((number / (this.selectedFood as Food).weight as number) * this.foodSelectionFormGroup.value.weight).toFixed(2));
    }
    return undefined;
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
    } else if (this.selectedPerson.targetIntake > 0) {
      this.maxIntakeForTheDay = this.selectedPerson.targetIntake;
    }
    return false;
  }

  private getSmileyAnimation(): string {
    return this.sportiveSmileyAnimation[this.indexRandomIcon];
  }

  getCurrentSmiley(): string {
    return this.getSmileyAnimation();
  }

  switchIntakeMacrosDisplay(): void {
    this.isInIntakeView = !this.isInIntakeView;
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

  private setFoodFromSelectedUser(): void {
    (this.serviceIntake.getAllFoodDocuments() as Observable<Food[]>).subscribe(value => {
      console.log(value);
      while(this.foods.length > 0) {
        this.foods.pop();
      }
      value.forEach(food => {
        this.foods.push({
          viewValue: food.foodName,
          food: new Food(
            food.foodName,
            food.calories,
            food.protein,
            food.fat,
            food.carbohydrates,
            food.weight,
            food.ownerUid
          )
        });
      });
    });
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

  goToScanner(): void {
    this.router.navigate(['scanner']);
  }

  protected readonly undefined = undefined;

  ngAfterViewInit(): void {
    this.spinnerDiameter = (document.getElementById('intakeSection') as HTMLElement).clientWidth;
  }
}
