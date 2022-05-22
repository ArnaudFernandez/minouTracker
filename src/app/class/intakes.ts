import firebase from "firebase/compat/app";
import Timestamp = firebase.firestore.Timestamp;

export class Intakes {
  intakeValue: number;
  nickname: string;
  titleIntake: string;
  date: Timestamp;
  dateFormatted: Date;

  constructor(intakeValue: number, nickname: string, titleIntake: string, date: Timestamp) {
    this.intakeValue = intakeValue;
    this.nickname = nickname;
    this.titleIntake = titleIntake;
    this.date = date;
    this.dateFormatted = this.date.toDate();
  }
}
