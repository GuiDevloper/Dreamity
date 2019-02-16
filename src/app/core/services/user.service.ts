import { Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from 'angularfire2/auth';
import {
  AngularFireDatabase,
  AngularFireList
} from 'angularfire2/database';
import { auth } from 'firebase/app';
import { Observable } from 'rxjs';
import { first } from 'rxjs/operators';
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

  getUser(uid: string, opt: number = 1): any {
    if (this.user && opt === 1) {
      return [this.user, true];
    } else {
      const userData = this.db.object(`users/${uid}`).valueChanges();
      userData.pipe(first()).subscribe(use => this.user = (use || '').toString());
      return [userData, false];
    }
  }

  /*
  * Puxa dados do profile
  * @param user = username
  **/
  getProfile(user: string, opt: number = 1): any {
    if (this.profile && opt === 1) {
      return [this.profile, true];
    } else {
      const prof = this.db.object(`/profiles/${user}`).valueChanges();
      prof.subscribe((pro: Profile) => this.profile = pro);
      return [prof, false];
    }
  }

  updateProfile(profile: Profile, old?: string): void {
    const profs = this.db.list(`/profiles/`);
    this.update(profile.username);
    profs.update(profile.username, profile).then(() => {
      this.goTo('')
        .then(() => this.goTo('/' + profile.username));
      if (old && old !== profile.username) {
        profs.remove(old);
      }
    });
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
        const uName = u.email.replace(/[@\W+\.~]/g, '').toLowerCase();
        const old = this.db.object(`/users/${u.uid}`);
        old.valueChanges().pipe(first()).subscribe(oldUser => {
          if (oldUser === null) {
            const newProfile = {
              username: uName,
              bio: 'Digite uma descrição mais completamente aqui',
              description: 'Digite aqui uma descrição de uma linha',
              img: u.photoURL
            };
            this.updateProfile(newProfile);
            this.goTo('/' + uName);
          } else {
            this.goTo('/' + oldUser);
          }
        });
      })
      .catch((err) => {
        throw err;
      });
  }

  update(username: string): void {
    this.isLogged().subscribe(use => {
      if (use) {
        const newUser = {};
        newUser[use.uid] = username;
        this.users.update('/', newUser);
      }
    });
  }

  create(uid: string, username: string): Promise<void> {
    const newUser = {};
    newUser[uid] = username;
    return this.users.update('/', newUser);
  }

  userExist(username: string): any {
    return this.db.list(`/profiles/${username.toLowerCase()}`).valueChanges().pipe(first()).toPromise();
  }

  /*
  * Redireciona usuario para url
  **/
  goTo(url: string): Promise<boolean> {
    return this.ngZone.run(() => {
      return this.router.navigateByUrl(url);
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
