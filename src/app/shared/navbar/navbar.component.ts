import { Component, OnInit, NgZone } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';

import { User, UserService } from '../../core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  navli: string[];
  User;
  logado: any = null;
  mostrar = false;

  constructor(public user: UserService,
    public ngz: NgZone,
    public ngAuth: AngularFireAuth) { }

  ngOnInit() {
    this.user.isLogged().subscribe(use => {
      if (use) {
        const u = this.user.getUser(use.uid);
        if (!u[1]) {
          u[0].subscribe(user => this.logado = user);
        } else {
          this.logado = u[0];
        }
      }
    });
  }
}
