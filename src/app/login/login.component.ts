import { AngularFireAuth } from 'angularfire2/auth';
import { Observable } from 'rxjs';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { User, UserService } from '../core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  User;
  users: Observable<any>;
  @Input() logType: string;

  isNewUser = false;
  username = '';
  email = '';
  password = '';
  errorMessage = '';
  error: { name: string, message: string } = { name: '', message: '' };
  @Output() logPost: EventEmitter<any> = new EventEmitter<any>();

  constructor(public user: UserService,
    private ngAuth: AngularFireAuth) {}

  ngOnInit() {
    this.isNewUser = this.logType.includes('Sign');
  }

  onLoginEmail(): void {
    this.clearErrorMessage();
    this.ngAuth.auth.signInWithEmailAndPassword(this.email, this.password)
      .then(a => {
        if (!this.logType.includes('Post')) {
          const u = this.user.getUser(a.user.uid);
          if (!u[1]) {
            u[0].subscribe(user => this.user.goTo(`/${user}`));
          } else {
            this.user.goTo(`/${u[0]}`);
          }
        } else {
          this.logPost.emit();
        }
      })
      .catch(err => {
        this.error = err;
      });
  }

  onSignUp(): void {
    this.clearErrorMessage();
    this.ngAuth.auth.createUserWithEmailAndPassword(this.email, this.password)
      .then(newUser => {
        this.user.create(newUser.user.uid, this.username)
        .then(() => {
          if (!this.logType.includes('Post')) {
            this.user.goTo(`/${this.username}`);
          } else {
            this.logPost.emit();
          }
        });
      })
      .catch(err => {
        this.error = err;
      });
  }

  login(prov): void {
    this.user.logWith(prov, this.logType.includes('Post'))
      .then(() => {
        if (this.logType.includes('Post')) {
          this.logPost.emit();
        }
      })
      .catch(error => {
        this.errorMessage = error.message;
      });
  }

  clearErrorMessage(): void {
    this.errorMessage = '';
    this.error = { name: '', message: '' };
  }
}
