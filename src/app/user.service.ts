import { Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from 'angularfire2/auth';
import { first } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { User } from './user';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(public ngAuth: AngularFireAuth,
    private ngZone: NgZone,
    private router: Router) { }

  userData(): Observable<firebase.User> {
    return this.ngAuth.authState.pipe(first());
  }

  Logout() {
    this.ngAuth.auth.signOut();
    const rt = this.router;
    const ngz = this.ngZone;
    ngz.run(() => {
      rt.navigateByUrl('/');
    });
  }
}
