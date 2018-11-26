import { Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from 'angularfire2/auth';
import { User } from './user';
import { AngularFireDatabase, AngularFireList, AngularFireObject } from 'angularfire2/database';
import { auth } from 'firebase/app';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  users: AngularFireList<{}>;
  user: string;
  profile: object;

  constructor(public ngAuth: AngularFireAuth,
    private ngZone: NgZone,
    private router: Router,
    public db: AngularFireDatabase) {
      this.users = db.list('/users/');
    }

  isLogged() {
    return this.ngAuth.authState;
  }

  getUser(uid): any {
    if (this.user) {
      return [this.user, true];
    } else {
      const userData = this.db.object(`users/${uid}`).valueChanges();
      userData.subscribe(use => this.user = use.toString());
      return [userData, false];
    }
  }

  logWith(provider) {
    provider = provider === 'git' ?
      new auth.GithubAuthProvider() : '';
    return this.ngAuth.auth.signInWithPopup(provider)
      .then(() => this.goTo(''))
      .catch((err) => {
        throw err;
      });
  }

  update(data) {
    this.isLogged().subscribe(use => {
      if (use) {
        this.db.object(`users/${use.uid}`).update(data);
      }
    });
  }

  create(uid, username) {
    const newUser = {};
    newUser[uid] = username;
    this.users.update('/', newUser);
  }

  goTo(url: string): void {
    this.ngZone.run(() => {
      this.router.navigateByUrl(url);
    });
  }

  Logout(): void {
    this.ngAuth.auth.signOut()
      .then(() => this.goTo(''));
  }

  handleError(error) {
    console.log(error);
    throw error;
  }
}
