export class Food {
  foodName: string;
  calories: number;
  protein: number;
  fat: number;
  carbohydrates: number;
  weight: number;
  ownerUid: string;

  constructor(foodName: string, calories: number, protein: number, fat: number, carbohydrates: number, weight: number, ownerUid: string) {
    this.foodName = foodName;
    this.calories = calories;
    this.protein = protein;
    this.fat = fat;
    this.carbohydrates = carbohydrates;
    this.weight = weight;
    this.ownerUid = ownerUid
  }
}
