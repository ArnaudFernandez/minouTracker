import firebase from "firebase/compat/app";
import Timestamp = firebase.firestore.Timestamp;

export class Intakes {
  eventId?: string;
  uid: string;
  intakeValue: number;
  protein: number;
  fat: number;
  carbohydrates: number;
  nickname: string;
  titleIntake: string;
  date: Timestamp;
  dateFormatted: Date;

  constructor(intakeValue: number, nickname: string, titleIntake: string, protein: number, fat: number, carbohydrates: number, date: Timestamp, uid: string) {
    this.intakeValue = intakeValue;
    this.nickname = nickname;
    this.uid = uid;
    this.titleIntake = titleIntake;
    this.date = date;
    this.dateFormatted = this.date.toDate();
    this.protein = protein;
    this.fat = fat;
    this.carbohydrates = carbohydrates;
  }
}
