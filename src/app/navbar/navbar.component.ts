import { Component, OnInit, NgZone } from '@angular/core';
import { UserService } from './../user.service';
import { User } from '../user';
import { AngularFireAuth } from 'angularfire2/auth';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  navli: string[];
  User;
  logado: any = null;

  constructor(public user: UserService,
    public ngz: NgZone,
    public ngAuth: AngularFireAuth) { }

  ngOnInit() {
    this.user.isLogged().then(a => {
      this.logado = a;
    });
  }

}
