import { Component, OnInit } from '@angular/core';

import { UserService } from '../../core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  logado: any = null;
  mostrar = false;
  showLog = false;
  logType: string;

  constructor(public user: UserService) { }

  ngOnInit() {
    this.user.isLogged().subscribe(use => {
      if (use) {
        const u = this.user.getUser(use.uid, 2);
        this.logado = u[0];
      }
    });
  }

  openLogin(type: string): void {
    this.showLog = true;
    this.logType = type;
  }
}
