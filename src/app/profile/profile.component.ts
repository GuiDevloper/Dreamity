import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase, AngularFireObject } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { Observable } from 'rxjs';
import { UserService } from '../user.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  users: Observable<any>;
  usua: any = null;
  text = '';
  profile: any = null;
  update = false;
  myProfile = false;
  data: AngularFireObject<{}>;

  constructor(
    private db: AngularFireDatabase,
    public ngAuth: AngularFireAuth,
    private user: UserService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.user.isLogged().subscribe(use => {
      if (use) {
        const u = this.user.getUser(use.uid);
        if (!u[1]) {
          u[0].subscribe(user => this.myProfile = !(!user));
        } else {
          this.myProfile = !(!u[0]);
        }
      }
    });
    this.usua = this.route.snapshot.paramMap.get('user');
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
