import { Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from 'angularfire2/auth';
import {
  AngularFireDatabase,
  AngularFireList
} from 'angularfire2/database';
import { auth } from 'firebase/app';
import { Observable } from 'rxjs';
import { User, Profile } from '../models';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  users: AngularFireList<{}>;
  user: string;
  profile: Profile;

  constructor(public ngAuth: AngularFireAuth,
    private ngZone: NgZone,
    private router: Router,
    public db: AngularFireDatabase) {
      this.users = db.list('/users/');
    }

  isLogged(): Observable<firebase.User> {
    return this.ngAuth.authState;
  }

  getUser(uid: string): any {
    if (this.user) {
      return [this.user, true];
    } else {
      const userData = this.db.object(`users/${uid}`).valueChanges();
      userData.subscribe(use => this.user = use.toString());
      return [userData, false];
    }
  }

  /*
  * Puxa dados do profile
  * @param user = username
  **/
  getProfile(user: string): any {
    if (this.profile) {
      return [this.profile, true];
    } else {
      const prof = this.db.object(`/profiles/${user}`).valueChanges();
      prof.subscribe((pro: Profile) => this.profile = pro);
      return [prof, false];
    }
  }

  updateProfile(user: string, data: object): void {
    this.db.object(`/profiles/${user}`).update(data);
  }

  /*
  * Autentica usando determinado provedor
  **/
  logWith(prov: string): Promise<void> {
    const provider = prov === 'git' ?
      new auth.GithubAuthProvider() : null;
    return this.ngAuth.auth.signInWithPopup(provider)
      .then(us => {
        const u: User = us.user;
        const uName = u.email.substring(0, u.email.indexOf('@'));
        this.create(u.uid, uName)
          .then(() => this.goTo('/' + uName));
      })
      .catch((err) => {
        throw err;
      });
  }

  update(data: object): void {
    this.isLogged().subscribe(use => {
      if (use) {
        this.db.object(`users/${use.uid}`).update(data);
      }
    });
  }

  create(uid: string, username: string): Promise<void> {
    const newUser = {};
    newUser[uid] = username;
    return this.users.update('/', newUser);
  }

  /*
  * Redireciona usuario para url
  **/
  goTo(url: string): void {
    this.ngZone.run(() => {
      this.router.navigateByUrl(url);
    });
  }

  Logout(): void {
    this.ngAuth.auth.signOut()
      .then(() => this.goTo(''));
  }

  handleError(error: string): void {
    console.log(error);
    throw error;
  }
}
