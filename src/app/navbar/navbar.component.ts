import { Component, OnInit, NgZone } from '@angular/core';
import { UserService } from './../user.service';
import { User } from '../user';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  navli: string[];
  User;

  constructor(public user: UserService, public ngz: NgZone) { }

  // async SE user está logado
  async isLogged() {
    let terceiro, quarto;
    const u = await this.user.userData();
    this.ngz.run(() => {
      this.User = u;
      // armazena 3o e 4o
      terceiro = this.User ?
        this.User.displayName.split(' ')[0] + ' Profile' : 'Log in';
      quarto = this.User ? 'Log out' : 'Sign in';
      // adiciona tudo a lista
      this.navli = ['Home', 'About', terceiro, quarto];
    });
  }

  ngOnInit() {
    this.isLogged();
  }

}
