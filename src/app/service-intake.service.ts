import {Injectable} from '@angular/core';
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {Intakes} from "./class/intakes";
import {Observable} from "rxjs";
import {AuthService} from './authentication/auth-service.service';
import {User} from './class/user';
import {Teams} from "./class/teams";
import {TeamMembers} from "./class/team-members";

@Injectable({
  providedIn: 'root'
})
export class ServiceIntakeService {

  database: AngularFirestore;

  constructor(db: AngularFirestore, protected authService: AuthService) {
    this.database = db;
  }


  /**
   *
   * ADD SECTION
   *
   * **/

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
      this.database.doc(`users/${this.authService.userData.uid}`).update({targetIntake: targetIntake});
    }
  }

  addNewTeam(teamName: string): void {
    if (JSON.parse(localStorage.getItem('user') as string).uid) {
      this.database.collection('teams').add({
        teamName: teamName,
        ownerUid: this.authService.userData.uid
      }).then(teamDocument => {
        this.database.collection('teamMembers').add({
          teamId: teamDocument.id,
          memberUid: this.authService.userData.uid,
          ownerUid: this.authService.userData.uid
        })
      });
    }
  }

  /**
   *
   * GET SECTION
   *
   **/

  getAllTeamsForUser(): Observable<TeamMembers[]> | undefined {
    if (JSON.parse(localStorage.getItem('user') as string).uid) {
      return (this.database.collection('teamMembers', ref =>
        ref.where('memberUid', '==', JSON.parse(localStorage.getItem('user') as string).uid)
      ).valueChanges() as Observable<TeamMembers[]>);
    }
    return undefined;
  }

  getTeamFromOwnerId(ownerUid: string): Observable<Teams[]> | undefined {
    console.log(ownerUid);
    return (this.database.collection('teams', ref =>
      ref.where('ownerUid', '==', ownerUid)
    ).valueChanges({idField: 'eventId'}) as Observable<Teams[]>);
  }

  getAllIntakesDocuments(): Observable<Intakes[]> | undefined {
    if (localStorage.getItem('user') !== undefined) {
      return this.database.collection('intakes', ref =>
        ref.where('uid', '==', JSON.parse(localStorage.getItem('user') as string).uid)
      ).valueChanges({idField: 'eventId'}) as Observable<Intakes[]>;
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

  getTeamMembersWithTeamId(teamId: string): Observable<TeamMembers[]> {
    return (this.database.collection('teamMembers', ref =>
      ref.where('teamId', '==', teamId)
    ).valueChanges() as Observable<TeamMembers[]>);
  }

  getUserByUid(uid: string): Observable<User[]> {
    return (this.database.collection('users', ref =>
      ref.where('uid', '==', uid)
    ).valueChanges() as Observable<User[]>);
  }

  getAllIntakesDocumentsByUid(uid: string): Observable<Intakes[]> {
    return this.database.collection('intakes', ref =>
      ref.where('uid', '==', uid)
    ).valueChanges() as Observable<Intakes[]>;
  }


  /**
   *
   * DELETE SECTION
   *
   * **/

  deleteIntake(idIntake: string): void {
    this.database.doc('intakes/'+idIntake).delete();
  }
}
