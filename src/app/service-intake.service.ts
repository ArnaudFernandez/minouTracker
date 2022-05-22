import { Injectable } from '@angular/core';
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {Intakes} from "./class/intakes";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ServiceIntakeService {

  database: AngularFirestore;

  constructor(db: AngularFirestore) {
    this.database = db;
  }

  addIntakes(nickname: string, intakeValue: number, titleIntake: string): void {
    this.database.collection('intakes').add({nickname: nickname, intakeValue: intakeValue, titleIntake: titleIntake, date: new Date()});
  }

  getAllIntakesDocuments(): Observable<Intakes[]> {
    return this.database.collection('intakes').valueChanges() as Observable<Intakes[]>;
  }
}
