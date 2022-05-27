import {Injectable, NgZone} from '@angular/core';
import {AngularFirestore, AngularFirestoreDocument} from '@angular/fire/compat/firestore';
import {Router} from '@angular/router';
import {AngularFireAuth} from '@angular/fire/compat/auth';
import {getAuth, GoogleAuthProvider, signInWithPopup} from 'firebase/auth';
import firebase from 'firebase/compat';
import OAuthCredential = firebase.auth.OAuthCredential;
import {UserCredential} from '@firebase/auth';
import {signInWithRedirect} from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  userData: any;

  constructor(
    public afs: AngularFirestore,
    public afAuth: AngularFireAuth,
    public router: Router,
    public ngZone: NgZone
  ) {
    /* Saving user data in localstorage when
    logged in and setting up null when logged out */
    this.afAuth.authState.subscribe((user) => {
      if (user) {
        this.userData = user;
        localStorage.setItem('user', JSON.stringify(this.userData));
        JSON.parse(localStorage.getItem('user')!);
      } else {
        localStorage.setItem('user', 'null');
        JSON.parse(localStorage.getItem('user')!);
      }
    });
  }

  private signWithRedirectPromise(): Promise<UserCredential> {

    const provider = new GoogleAuthProvider();

    provider.addScope('https://www.googleapis.com/auth/contacts.readonly');
    const auth = getAuth();
    auth.languageCode = 'fr';

    return signInWithRedirect(auth, provider)
  }

  private signWithPopupPromise(): Promise<UserCredential> {

    const provider = new GoogleAuthProvider();

    provider.addScope('https://www.googleapis.com/auth/contacts.readonly');
    const auth = getAuth();
    auth.languageCode = 'fr';

    return signInWithPopup(auth, provider)
  }

  signInWithGoogle(): void {
    this.signWithPopupPromise()
      .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = (credential as OAuthCredential).accessToken;
        // The signed-in user info.
        const user = result.user;
        this.setUserData(user);
        this.router.navigate(['tracker']);
      }).catch((error) => {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      // The email of the user's account used.
      const email = error.customData.email;
      // The AuthCredential type that was used.
      const credential = GoogleAuthProvider.credentialFromError(error);

      // Print errors in console
      console.log('Code :' + errorCode + '/ Message :' + errorMessage);
    });
  }

  private setUserData(user: any) {
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(
      `users/${user.uid}`
    );
    this.userData = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      emailVerified: user.emailVerified,
      targetIntake: 0
    };
    return userRef.set(this.userData, {
      merge: true,
    });
  }

  private setPersonData(uid: string): void {
    const personRef: AngularFirestoreDocument<any> = this.afs.doc(
      `person/${uid}`
    );
    const person = {
      uid: uid
    }
    personRef.set(person, {
      merge: true,
    });
  }

  get isLoggedIn(): boolean {
    const user = JSON.parse(localStorage.getItem('user')!);
    return user !== null && user.emailVerified !== false;
  }

  signOut() {
    return this.afAuth.signOut().then(() => {
      localStorage.removeItem('user');
      this.router.navigate(['tracker']);
    });
  }
}
