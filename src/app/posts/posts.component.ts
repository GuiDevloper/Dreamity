import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import {
  PostService,
  UserService,
  CommentService,
  Profile
} from '../core';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.scss']
})
export class PostsComponent implements OnInit {
  dreams: Array<object>;

  // novo coment
  comment: string;
  // usuário logado
  User: string = null;
  // todos autores dos posts
  author: Array<string>;
  // id de cada post
  id: Array<string> | string;

  comments: Array<any>;
  commenter = false;
  isDream = false;
  profile: Profile = null;
  progress: number = null;
  newPost: number = null;
  rtSnap = this.route.snapshot;
  rtUrl = this.rtSnap.url.toString().split(',');
  // é main-page
  isMain = this.rtUrl[0] === '';
  showModal = false;
  warModal = 'ih rapaz';
  Cdel: number;

  constructor(private post: PostService,
    private coment: CommentService,
    private route: ActivatedRoute,
    private user: UserService) { }

  ngOnInit() {
    this.user.isLogged().subscribe(use => {
      // SE logado
      if (use) {
        const u = this.user.getUser(use.uid);
        if (!u[1]) {
          u[0].subscribe(username => {
            // armazena username
            this.User = this.rtUrl[0] !== '' ? username : '';
          });
        } else {
          this.User = this.rtUrl[0] !== '' ? u[0] : '';
        }
      }
    });
    const paramMap = this.rtSnap.paramMap;
    // SE estiver em um sonho
    if (this.rtUrl[1] === 'p') {
      this.commenter = true;
      this.isDream = true;
      this.coment.show = false;
      this.loadPosts(paramMap.get('profile') || '');
    } else {
      // Deverá listar
      this.loadPosts(paramMap.get('user') || '');
    }
  }

  /*
  * Manipula posts separando dados
  **/
  loadPosts(userUrl: string): void {
    // carrega posts de user ou de todos
    this.post.getPosts(userUrl).subscribe(allPosts => {
      allPosts = allPosts || {};
      // Limpa armazenadores
      this.dreams = [];
      this.comments = [];
      // Obtendo todos os autores
      this.author = userUrl === '' ? Object.keys(allPosts) : [userUrl];
      // percorre autores separando
      for (const author of this.author) {
        const posts = allPosts[author] || allPosts;
        // id de posts por autor
        this.id = Object.keys(posts).reverse();
        Object.values(posts).reverse().forEach((a, i) => {
          // guardando autor de cada id
          a['author'] = author;
          // comentarios de cada post
          this.comments[i] = this.coment.getComents(this.id[i]) || {};
          // guarda Date formatado de cada post
          a['time'] = this.post.getDate(a['time']);
          this.dreams.push(a);
        });
      }
      if (this.isDream) {
        // index do sonho
        const iDream = this.rtSnap.paramMap.get('dream');
        // especifica dados para este sonho apenas
        this.id = this.id[iDream];
        this.dreams = [this.dreams[iDream]];
        this.post.restart(this.dreams);
        this.comments[iDream].subscribe(com => {
          const pro = this.user.getProfile(userUrl);
          if (!pro[1]) {
            pro[0].subscribe(prof => {
              this.profile = prof;
              this.storeLvls(com);
            });
          } else {
            this.profile = pro[0];
            this.storeLvls(com);
          }
        });
      }
    });
  }

  /*
  * Verifica e armazena lvls do post aberto
  * comm = comentários deste post
  **/
  storeLvls(comm: object) {
    comm = comm || {lvls: {guidevloper: 10}};
    const lvlLen = this.coment.hasLvls(comm);
    let len = 0;
    // SE tem lvls e tamanho > 0
    if (!lvlLen[0] && lvlLen[1] > 0) {
      this.progress = this.coment.somaLvls(comm);
      len = +lvlLen[1] - 1;
    } else {
      len = +lvlLen[1];
    }
    this.coment.lvl = comm['lvls'][this.profile.username];
    this.comments = [
      Object.keys(comm).slice(0, len),
      Object.values(comm).slice(0, len)
    ];
    this.coment.show = true;
  }

  /*
  * get de comentários async, SE há newPost traz coments anteriores
  * @param obj = comentários
  * @param i = index do post
  **/
  of(obj, i) {
    return obj[this.newPost === 0 ? (i - 1) : i];
  }

  /*
  * SE post -> retorna title + autor
  * @param i = index do post
  * @param title = titulo do post
  **/
  parseTitle(i: number, title: string = null): string {
    const author = this.dreams[i]['author'];
    return this.isDream && title ? title :
      (title === null ? this.getAuthor(i) + ':.' : title);
  }

  /*
  * Evita exibir texto maior que layout
  * @param post = texto do post
  */
  limitText(post: string): string {
    return (this.isDream || post.length < 100) ?
      post : post.substring(0, 100) + '..';
  }

  /*
  * Obtem autor deste post
  * @param id = index do post
  **/
  getAuthor(id: number): string {
    // SEnao post -> retorna autor pelo array de ids
    return this.isDream ? this.dreams[id]['author'] :
      (this.isNew(id) ? this.User : this.dreams[id]['author']);
  }

  /*
  * Posta sonho em nome de user logado
  **/
  onPost(): void {
    if (this.post.title && this.post.text) {
      this.newPost = null;
      this.post.create(this.User, this.dreams);
    } else {
      console.log('Preencha todos os campos');
    }
  }

  /*
  * Armazena dados de novo post
  * @param input = onde está o novo dado
  * @param evt = evento disparado no input
  **/
  writeNew(input?: string, evt?): void {
    this.post[input] = evt ? evt.target.value : '';
    if (!this.isDream && this.newPost !== 0) {
      this.dreams.unshift({title: '', text: '', img: 0});
      this.newPost = 0;
    }
  }

  /*
  * Posta comentário neste post
  **/
  onComment(): void {
    // usa id do post
    this.coment.create(this.id.toString(), [this.User, this.comment]);
  }

  /*
  * Abre sonho
  * @param path = index do sonho
  **/
  openPost(path: string): void {
    if (!this.isDream && !this.isNew(+path)) {
      path = `${this.author[0]}/p/${path}`;
      this.user.goTo(path);
    }
  }

  /*
  * get que verifica se é post novo
  * @param i = index deste post
  **/
  isNew(i: number): boolean {
    return this.newPost === 0 && i === this.newPost;
  }

  /*
  * Modifica imagem do novo post
  * @param img = nova img
  **/
  newBack(img: string): void {
    this.dreams[0]['img'] = img;
  }

  editPost(): void {
    this.post.update(this.User, this.id, this.dreams[0]);
    /* ativar em produção
    console.log(this.comments[1]);
    console.clear();*/
  }

  delPost(): void {
    this.warModal = 'Tens a real certeza apagando este sonho?';
    this.showModal = true;
  }

  continueDelP(): void {
    this.post.delete(this.User, this.id.toString())
      .then(() => {
        this.warModal = 'Sonho removido daqui';
        setTimeout(() => this.user.goTo(''), 3000);
      })
      .catch(err => this.warModal = err);
  }

  editCom(i: number): void {
    this.coment.update(this.id.toString(), i, this.comments);
  }

  /*
  * Apaga comentário
  * @param i = index do comentario
  **/
  delCom(i: number): void {
    this.warModal = 'Tens a real certeza apagando este comentário?';
    this.showModal = true;
    this.Cdel = i;
  }

  continueDelC(): void {
    this.coment.delete(this.id.toString(), this.comments[0][this.Cdel])
      .then(() => {
        this.warModal = 'Comentário removido';
        setTimeout(() => this.showModal = false, 3000);
      })
      .catch(err => this.warModal = err);
  }

}
