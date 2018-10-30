import { AngularFireDatabase } from 'angularfire2/database';
import { Component, OnInit } from '@angular/core';
import { PostService } from '../post.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.scss']
})
export class PostsComponent implements OnInit {
  posts: any = [];
  title: string;
  text: string;
  comment: string;
  usua: string;
  author;
  id;
  authors = {};
  comments = [];

  constructor(private db: AngularFireDatabase,
    private post: PostService,
    private route: ActivatedRoute) { }

  ngOnInit() {
    this.usua = this.route.snapshot.paramMap.get('user') || '';
    this.db.object(`/posts/${this.usua}`).valueChanges().subscribe(
      posts => {
        // Limpando
        this.posts = [];
        this.comments = [];
        // Obtendo autores
        this.author = Object.keys(posts);
        for (const author of this.author) {
          // chaves de posts por autor
          this.id = Object.keys(posts[author]);
          Object.values(posts[author]).forEach((a, i) => {
            // guardando autor de cada
            this.authors[this.id[i]] = author;
            // comentarios de cada
            this.comments.push(Object.values(a['comments'] || {}));
            this.posts.push(a);
          });
        }
      });
  }

  onPost(): void {
    this.post.add(this.usua, {title: this.title, text: this.text});
  }

  onComment(path): void {
    this.post.comment(path, {author: this.usua, text: this.comment});
  }
}
