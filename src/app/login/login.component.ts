import { AngularFireAuth } from 'angularfire2/auth';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { UserService } from '../core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  @Input() logType: string;

  isNewUser = false;
  acc = {
    username: '',
    email: '',
    password: '' };
  errorMessage = '';
  @Output() logPost: EventEmitter<any> = new EventEmitter<any>();

  constructor(public user: UserService,
    private ngAuth: AngularFireAuth) {}

  ngOnInit() {
    this.isNewUser = this.logType.includes('Sign');
  }

  onLoginEmail(): void {
    this.errorMessage = '';
    let acc = this.acc;
    acc = {
      email: acc.email.trim(),
      password: acc.password.trim(), username: '' };
    if (acc.email.length > 0 && acc.password.length > 0) {
      this.ngAuth.auth.signInWithEmailAndPassword(acc.email, acc.password)
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
        this.errorMessage = err.message;
      });
    } else {
      this.errorMessage = 'Preencha todos os campos';
    }
  }

  onSignUp(): void {
    this.errorMessage = '';
    let acc = this.acc;
    acc = {
      email: acc.email.trim(),
      password: acc.password.trim(),
      username: acc.username.trim() };
    if (acc.email.length > 0 &&
      acc.password.length > 0 &&
      acc.username.length) {
      this.user.userExist(acc.username).then(ex => {
        if (ex.length === 0) {
          this.ngAuth.auth
            .createUserWithEmailAndPassword(acc.email, acc.password)
            .then(() => {
              this.user.create(acc.username).then(() => {
                if (!this.logType.includes('Post')) {
                  this.user.goTo(`/${acc.username}`);
                } else {
                  this.logPost.emit();
                }
              });
            })
            .catch(err => {
              this.errorMessage = err.message;
            });
        } else {
          this.errorMessage = 'Username already in use by another account.';
        }
      });
    } else {
      this.errorMessage = 'Preencha todos os campos';
    }
  }

  login(prov): void {
    this.errorMessage = '';
    const isPost = this.logType.includes('Post')
    this.user.logWith(prov, isPost)
      .then(() => {
        if (isPost) {
          this.logPost.emit();
        }
      })
      .catch(error => {
        this.errorMessage = error.message;
      });
  }

  turnNew(): void {
    this.isNewUser = !this.isNewUser;
    this.errorMessage = '';
  }
}
