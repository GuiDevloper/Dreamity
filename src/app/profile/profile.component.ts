import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { UserService } from '../core';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  usua: any = null;
  profile: any = null;
  update = false;
  myProfile = false;

  constructor(private user: UserService,
    private route: ActivatedRoute) {}

  ngOnInit() {
    this.usua = this.route.snapshot.paramMap.get('user');
    this.user.isLogged().subscribe(use => {
      if (use) {
        const u = this.user.getUser(use.uid);
        if (!u[1]) {
          // Armazena se este usuario está no profile
          u[0].subscribe(user => this.myProfile = user === this.usua);
        } else {
          this.myProfile = u[0] === this.usua;
        }
      }
    });
    // Obtem profile pela url
    const pro = this.user.getProfile(this.usua);
    if (!pro[1]) {
      pro[0].subscribe(prof => this.profile = prof);
    } else {
      this.profile = pro[0];
    }
  }

  editProfile() {
    this.user.updateProfile(this.usua, this.profile);
    this.update = false;
  }

}
