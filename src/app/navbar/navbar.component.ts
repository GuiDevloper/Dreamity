import { Observable } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { UserService } from './../user.service';
import { share } from 'rxjs/operators';
import { User } from '../user';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  navli = [];
  User: Observable<firebase.User>;

  constructor(public user: UserService) {
    this.isLogged();
  }
  // async SE user está logado
  async isLogged() {
    this.User = await this.user.userData();
    let terceiro, quarto;
    // armazena 3o e 4o
    if (this.User) {
      this.User.toPromise().then(function(val) {
        terceiro = val.displayName;
      });
    }
    quarto = this.User ? 'Log out' : 'Sign in';
    // adiciona tudo a lista
    this.navli = ['Home', 'About', terceiro, quarto];
  }

  ngOnInit() {
  }

}
