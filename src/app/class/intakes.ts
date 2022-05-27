import firebase from "firebase/compat/app";
import Timestamp = firebase.firestore.Timestamp;

export class Intakes {
  uid: string;
  intakeValue: number;
  nickname: string;
  titleIntake: string;
  date: Timestamp;
  dateFormatted: Date;

  constructor(intakeValue: number, nickname: string, titleIntake: string, date: Timestamp, uid: string) {
    this.intakeValue = intakeValue;
    this.nickname = nickname;
    this.uid = uid;
    this.titleIntake = titleIntake;
    this.date = date;
    this.dateFormatted = this.date.toDate();
  }
}
