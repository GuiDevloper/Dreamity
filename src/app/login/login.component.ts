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
  userName: string;
  User;
  users: Observable<any>;

  constructor(public user: UserService, public db: AngularFireDatabase) {
    this.users = db.object('/users/1/login').valueChanges();
    this.welcome();
  }

  ngOnInit() {
  }
  async welcome() {
    this.User = this.user.userData();
    this.userName = this.User ? this.User.displayName : 'Type abaixo';
  }

  login() {
    this.user.goTo('profile');
  }

}
