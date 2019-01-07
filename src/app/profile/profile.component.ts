import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Profile, UserService } from '../core';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  profile: Profile;
  update = false;
  myProfile = false;
  atualUsername: string;

  constructor(private user: UserService,
    private route: ActivatedRoute) {}

  ngOnInit() {
    this.atualUsername = this.route.snapshot.paramMap.get('user');
    // Obtem profile pela url
    const pro = this.user.getProfile(this.atualUsername, 2);
    pro[0].subscribe((prof: Profile) => {
      this.setProfile(prof);
    });
    this.user.isLogged().subscribe(use => {
      if (use) {
        const u = this.user.getUser(use.uid, 2);
        // Armazena se este usuario está no profile
        u[0].subscribe((user: string) => {
          this.setIsMy(user === this.atualUsername);
        });
      }
    });
  }

  setIsMy(isMy: boolean): void {
    this.myProfile = isMy;
  }

  setProfile(prof: Profile): void {
    this.profile = prof;
  }

  editProfile() {
    this.user.updateProfile(this.profile, this.atualUsername);
    this.update = false;
  }

}
