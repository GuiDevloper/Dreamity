import { AngularFireAuth } from 'angularfire2/auth';
import { Observable } from 'rxjs';
import { UserService } from '../user.service';
import { Component, OnInit } from '@angular/core';
import { User } from '../user';

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

  constructor(private user: UserService,
    private ngAuth: AngularFireAuth) {}

  ngOnInit() {
  }

  onLoginEmail(): void {
    this.clearErrorMessage();
    this.ngAuth.auth.signInWithEmailAndPassword(this.email, this.password)
      .then(a => {
        this.user.getUser(a.user.uid).subscribe(use => {
          this.user.goTo(`/${use}`);
        });
      })
      .catch(err => {
        this.error = err;
      });
  }

  onSignUp(): void {
    this.clearErrorMessage();
    this.ngAuth.auth.createUserWithEmailAndPassword(this.email, this.password)
      .then(newUser => {
        this.user.create(newUser.user.uid, this.username);
        this.user.goTo(`/${this.username}`);
      })
      .catch(err => {
        this.error = err;
      });
  }

  changeForm(): void {
    this.isNewUser = !this.isNewUser;
  }

  login(prov): void {
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
