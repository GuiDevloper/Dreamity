import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  posts: any;

  constructor(private db: AngularFireDatabase) {
  }

  add(user, value) {
    this.db.list(`/posts/${user}`).push(value);
  }

  comment(path, value) {
    this.db.list(`/posts/${path}`).push(value);
  }
}
