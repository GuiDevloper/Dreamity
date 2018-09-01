import { Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from 'angularfire2/auth';
import { User } from './user';
import { Observable } from 'rxjs';
import { AngularFireDatabase } from 'angularfire2/database';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  user: User;
  users: Observable<any>;

  constructor(public ngAuth: AngularFireAuth,
    private ngZone: NgZone,
    private router: Router, public db: AngularFireDatabase) {
      this.users = db.object('/users/1/login').valueChanges();
    }

  async userData() {
    this.ngAuth.authState.subscribe(use => {
      this.user = use;
    });
    return await this.user;
  }

  Logout(): void {
    this.ngAuth.auth.signOut();
    this.goTo('');
  }

  logWith(provider): void {
    const rt = this.router;
    const ngz = this.ngZone;
    this.ngAuth.auth.signInWithPopup(provider).then((result) => {
      this.goTo('');
    }).catch((err) => {
      this.logWith(provider);
    });
  }

  goTo(url: string): void {
    const rt = this.router;
    const ngz = this.ngZone;
    ngz.run(() => {
      rt.navigateByUrl(url);
    });
  }
}
