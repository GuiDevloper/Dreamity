import { Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from 'angularfire2/auth';
import { User } from './user';
import { AngularFireDatabase } from 'angularfire2/database';
import { auth } from 'firebase/app';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  user: User;
  users: any;

  constructor(public ngAuth: AngularFireAuth,
    private ngZone: NgZone,
    private router: Router,
    public db: AngularFireDatabase) {
      this.users = db.object('/users/');
    }

  async isLogged() {
    return await this.ngAuth.authState;
  }

  loginWithEmail(user, password) {
    return this.ngAuth.auth.signInWithEmailAndPassword(user, password)
      .catch(err => {
        this.handleError(err);
      });
  }

  signUpWithEmail(user, email, password) {
    return this.ngAuth.auth.signInWithEmailAndPassword(email, password)
      .then(() => {
        this.users.push(user);
        this.goTo(`profile/${user}`);
      })
      .catch(err => {
        this.handleError(err);
      });
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

  goTo(url: string): void {
    this.ngZone.run(() => {
      this.router.navigateByUrl(url);
    });
  }

  Logout(): void {
    this.ngAuth.auth.signOut();
    this.goTo('');
  }

  handleError(error) {
    throw error;
  }
}
