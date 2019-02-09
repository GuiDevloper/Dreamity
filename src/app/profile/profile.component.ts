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
  inUser = false;
  showModal = false;
  warModal = 'ih rapaz';
  loaded = false;

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
          this.loaded = true;
        });
      } else {
        this.loaded = true;
      }
    });
  }

  setIsMy(isMy: boolean): void {
    this.myProfile = isMy;
  }

  setProfile(prof: Profile): void {
    this.profile = prof;
  }

  editProfile(): void {
    if (!this.inUser) {
      const prof = this.profile;
      prof.bio = prof.bio.substr(0, 200);
      prof.description = prof.description.substr(0, 40);
      this.user.updateProfile(prof, this.atualUsername);
      this.update = false;
    } else {
      this.warModal = 'Nome de usuário já em uso!';
      this.showModal = true;
    }
  }

  testUser(): void {
    const newUsername = this.profile.username;
    if (this.atualUsername !== newUsername) {
      setTimeout(() => this.user.userExist(newUsername)
      .then(e => {
        this.inUser = e.length > 0;
      }), 250);
    }
  }

}
