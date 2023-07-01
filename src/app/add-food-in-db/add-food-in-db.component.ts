import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ServiceIntakeService} from "../service-intake.service";
import {Food} from "../class/food";
import {MatDialog} from "@angular/material/dialog";

@Component({
  selector: 'app-add-food-in-db',
  templateUrl: './add-food-in-db.component.html',
  styleUrls: ['./add-food-in-db.component.scss']
})
export class AddFoodInDBComponent implements OnInit {

  foodForm: FormGroup | undefined = undefined;

  serviceIntake: ServiceIntakeService;

  constructor(private formBuilder: FormBuilder,
              private dialogRef: MatDialog,
              serviceIntake: ServiceIntakeService,
  ) {
    this.serviceIntake = serviceIntake;
  }

  ngOnInit() {
    this.foodForm = this.formBuilder.group({
      foodName: ['', Validators.required],
      calories: ['', Validators.required],
      protein: ['', Validators.required],
      carbohydrates: ['', Validators.required],
      fat: ['', Validators.required],
      weight: ['', Validators.required],
    });
  }

  addFood() {
    if (this.foodForm && this.foodForm.valid) {
      this.serviceIntake.addNewFood(new Food(
        this.foodForm.value.foodName,
        this.foodForm.value.calories,
        this.foodForm.value.protein,
        this.foodForm.value.fat,
        this.foodForm.value.carbohydrates,
        this.foodForm.value.weight,
        JSON.parse(localStorage.getItem('user') as string).uid
      ))?.then(() => {
        this.dialogRef.closeAll();
      });
    } else {

    }
  }

  protected readonly FormGroup = FormGroup;
}
