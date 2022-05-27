import {Injectable} from '@angular/core';
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {Intakes} from "./class/intakes";
import {Observable} from "rxjs";
import {AuthService} from './authentication/auth-service.service';
import {User} from './class/user';

@Injectable({
  providedIn: 'root'
})
export class ServiceIntakeService {

  database: AngularFirestore;

  constructor(db: AngularFirestore, protected authService: AuthService) {
    this.database = db;
  }

  addIntakes(nickname: string, intakeValue: number, titleIntake: string): void {
    if (this.authService.userData.uid) {
      this.database.collection('intakes').add({
        nickname: nickname,
        intakeValue: intakeValue,
        titleIntake: titleIntake,
        date: new Date(),
        uid: this.authService.userData.uid
      });
    }
  }

  addTargetIntake(targetIntake: number): void {
    if (JSON.parse(localStorage.getItem('user') as string).uid) {

      const personDoc = this.database.doc(`person/${this.authService.userData.uid}`);
      const personObject = JSON.parse(localStorage.getItem('user') as string) as User;
      const finalObjectToSave = {
        uid: personObject.uid,
        nickname: personObject.displayName,
        targetIntake: targetIntake
      }
      personDoc.set(finalObjectToSave, {
        merge: true,
      });
      this.database.doc(`person/${this.authService.userData.uid}`).update({targetIntake: targetIntake});
    }
  }

  getAllIntakesDocuments(): Observable<Intakes[]> | undefined{
    if (localStorage.getItem('user') !== undefined) {
      return this.database.collection('intakes', ref =>
        ref.where('uid', '==', JSON.parse(localStorage.getItem('user') as string).uid)
      ).valueChanges() as Observable<Intakes[]>;
    }
    return undefined;
  }

  getPersonConnectedInfos(): Observable<User[]> | undefined {
    if (localStorage.getItem('user') !== undefined) {
      return this.database.collection('person', ref =>
        ref.where('uid', '==', JSON.parse(localStorage.getItem('user') as string).uid)
      ).valueChanges() as Observable<User[]>;
    }
    return undefined;
  }
}
