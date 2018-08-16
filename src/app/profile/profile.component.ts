import { Component, OnInit, NgZone } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { auth } from 'firebase/app';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  users: Observable<any>;

  constructor(
    db: AngularFireDatabase,
    public ngAuth: AngularFireAuth,
    private ngZone: NgZone,
    private router: Router
  ) {
    this.users = db.object('/users/1/login').valueChanges();
  }
  login() {
    const git = new auth.GithubAuthProvider();
    const rt = this.router;
    const ngz = this.ngZone;
    this.ngAuth.auth.signInWithPopup(git).then(function() {
      ngz.run(() => {
        rt.navigateByUrl('/');
      });
    });
  }
  logout() {
    this.ngAuth.auth.signOut();
  }

  ngOnInit() {
  }

}
