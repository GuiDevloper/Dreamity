import { Observable } from 'rxjs';
import { UserService } from '../user.service';
import { Component, OnInit } from '@angular/core';
import { User } from '../user';
import { AngularFireDatabase } from 'angularfire2/database';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  User;
  users: Observable<any>;

  isNewUser = true;
  username = '';
  email = '';
  password = '';
  errorMessage = '';
  error: { name: string, message: string } = { name: '', message: '' };

  constructor(public user: UserService,
    public db: AngularFireDatabase) {
    this.users = this.db.object('/users/1/login').valueChanges();
  }

  ngOnInit() {
  }

  onLoginEmail(): void {
    this.clearErrorMessage();

    this.user.loginWithEmail(this.email, this.password)
      .then(() => this.user.goTo('profile'))
      .catch(_error => {
        this.error = _error;
      });
  }

  onSignUp(): void {
    this.clearErrorMessage();

    this.user.signUpWithEmail(this.username, this.email, this.password)
      .then(() => this.user.goTo(`profile/${this.username}`))
      .catch(_error => {
        this.error = _error;
      });
  }

  changeForm(): void {
    this.isNewUser = !this.isNewUser;
  }

  login(prov) {
    this.user.logWith(prov)
      .catch(error => {
        this.errorMessage = error.message;
      });
  }

  clearErrorMessage(): void {
    this.errorMessage = '';
    this.error = { name: '', message: '' };
  }
}
