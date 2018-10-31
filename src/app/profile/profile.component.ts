import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
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
  profile: any;

  constructor(
    private db: AngularFireDatabase,
    public ngAuth: AngularFireAuth,
    private User: UserService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.usua = this.route.snapshot.paramMap.get('user') || 'guidevloper';
    this.db.object(`/profiles/${this.usua}`).valueChanges().subscribe(
      pro => {
        // obtendo profile de acordo com url
        this.profile = pro;
      });
  }
}
