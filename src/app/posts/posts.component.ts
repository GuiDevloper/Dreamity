import { AngularFireDatabase, AngularFireObject } from 'angularfire2/database';
import { Component, OnInit } from '@angular/core';
import { PostService } from '../post.service';
import { ActivatedRoute } from '@angular/router';
import { UserService } from './../user.service';
import { Observable, of } from 'rxjs';
import { CommentService } from './../comment.service';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.scss']
})
export class PostsComponent implements OnInit {
  posts: Array<object>;
  // Dados do sonho postado
  title: string;
  text: string;
  // novo coment
  comment: string;
  // usuário logado
  usua: string = null;
  // todos autores dos posts
  author: Array<string>;
  // id de cada post
  id: Array<string>;
  // autores por id de post
  authors: object = {};

  comments: undefined[] | Observable<{}[]>;
  commenter = false;
  isDream = false;
  profile: object = null;
  // lvl de imagination
  lvl: number = null;
  progress: number = null;

  constructor(private db: AngularFireDatabase,
    private post: PostService,
    private coment: CommentService,
    private route: ActivatedRoute,
    private user: UserService) { }

  ngOnInit() {
    const rtSnap = this.route.snapshot;
    const rtUrl = rtSnap.url.toString().split(',');
    // SE estiver em um sonho
    if (rtUrl[1] === 'p') {
      this.commenter = true;
      this.usua = rtSnap.paramMap.get('profile');
      this.isDream = true;
      this.loadPosts();
    } else {
      // Deverá listar
      this.user.isLogged().subscribe(use => {
        this.usua = rtSnap.paramMap.get('user');
        // SE logado e estiver no profile
        if (use) {
          const u = this.user.getUser(use.uid);
          if (!u[1]) {
            u[0].subscribe(username => {
              // armazena username
              this.usua = rtUrl[0] !== '' ? username : '';
            });
          } else {
            this.usua = rtUrl[0] !== '' ? u[0] : '';
          }
        }
        if (!this.usua) {
          this.usua = '';
        }
        this.loadPosts();
      });
    }
  }

  /*
  * Manipula posts separando dados
  **/
  loadPosts(): void {
    // carrega posts de user ou de todos
    this.post.getPosts(this.usua).subscribe(posts => {
      // Limpa armazenadores
      this.posts = [];
      this.comments = [];
      // Obtendo todos os autores
      this.author = this.usua === '' ? Object.keys(posts) : [this.usua];
      // percorre autores separando
      for (const author of this.author) {
        // id de posts por autor
        this.id = Object.keys(posts[author] || posts);
        Object.values(posts[author] || posts)
        .forEach((a, i) => {
          // guardando autor de cada id
          this.authors[this.id[i]] = author;
          // comentarios de cada post
          this.comments[i] = this.coment.getComents(this.id[i], i) || [];
          // guarda Date formatado de cada post
          a['time'] = this.post.getDate(a['time']);
          this.posts.push(a);
        });
        // console.log(this.of(this.comments[0][0]));
      }
      if (this.isDream) {
        // index do sonho
        const iDream = this.route.snapshot.paramMap.get('dream');
        // especifica dados para este sonho apenas
        this.id = this.id[iDream];
        this.posts = [this.posts[iDream]];
        if (!this.comments[iDream][1]) {
          this.comments[iDream][0].subscribe(com => this.storeLvls(com));
        } else {
          this.storeLvls(this.comments[iDream][0]);
        }
        const pro = this.user.getProfile(this.usua);
        if (!pro[1]) {
          pro[0].subscribe(prof => this.profile = prof);
        } else {
          this.profile = pro[0];
        }
      }
    });
  }
  storeLvls(comm) {
    const lvlLen = this.coment.hasLvls(comm);
    // SE tem lvls e array > 0
    if (!lvlLen[0] && lvlLen[1] > 0) {
      this.progress = this.coment.somaLvls(comm);
    }
    this.comments = comm;
  }
  of(obj) {
    if (obj.source) {
      return of(obj)['value'];
    } else {
      return of(obj);
    }
  }

  /*
  * SE post -> retorna title + autor
  * @param title: titulo do post
  * @param author: autor do post
  **/
  parseTitle(title, author): string {
    return this.isDream ? title : title + ' - ' + author;
  }

  /*
  * Evita exibir texto maior que layout
  * @param post: string = texto do post
  */
  limitText(post): string {
    return (this.isDream || post.length < 100) ?
      post : post.substring(0, 100) + '..';
  }

  /*
  * Obtem autor deste post
  * @param id: number = index do post
  **/
  getAuthor(id): string {
    // SEnao post -> retorna autor pelo array de ids
    return this.isDream ? this.authors[this.id.toString()] :
      this.authors[this.id[id]];
  }

  /*
  * Posta sonho em nome de user logado
  **/
  onPost(): void {
    this.post.create(this.usua,
      [this.title, this.text, new Date().getTime()]
    );
  }

  /*
  * Posta comentário neste post
  **/
  onComment(): void {
    // usa id do post
    this.coment.create(this.id, [this.usua, this.comment]);
  }

  /*
  * Abre sonho
  * @param path: string = index do sonho
  **/
  openPost(path): void {
    if (!this.isDream) {
      path = `${this.author[0]}/p/${path}`;
      this.user.goTo(path);
    }
  }

  /*
  * Atualiza lvl do sonho
  **/
  updateLvl(): void {
    const newVal = {};
    newVal[this.usua] = this.lvl;
    this.coment.update(this.id, newVal);
  }

}
