import { Component, OnInit } from '@angular/core';
import { PostService } from '../post.service';
import { ActivatedRoute } from '@angular/router';
import { UserService } from './../user.service';
import { CommentService } from './../comment.service';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.scss']
})
export class PostsComponent implements OnInit {
  dreams: Array<object>;
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
  id: Array<string> | string;

  comments: Array<any>;
  commenter = false;
  isDream = false;
  profile: object = null;
  progress: number = null;
  newPost: number = null;

  constructor(private post: PostService,
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
      this.coment.show = false;
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
      this.dreams = [];
      this.comments = [];
      // Obtendo todos os autores
      this.author = this.usua === '' ? Object.keys(posts) : [this.usua];
      // percorre autores separando
      for (const author of this.author) {
        // id de posts por autor
        this.id = Object.keys(posts[author] || posts).reverse();
        Object.values(posts[author] || posts).reverse()
        .forEach((a, i) => {
          // guardando autor de cada id
          a['author'] = author;
          // comentarios de cada post
          this.comments[i] = this.coment.getComents(this.id[i]) || [];
          // guarda Date formatado de cada post
          a['time'] = this.post.getDate(a['time']);
          this.dreams.push(a);
        });
      }
      if (this.isDream) {
        // index do sonho
        const iDream = this.route.snapshot.paramMap.get('dream');
        // especifica dados para este sonho apenas
        this.id = this.id[iDream];
        this.dreams = [this.dreams[iDream]];
        this.comments[iDream].subscribe(com => this.storeLvls(com));
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
    let len = 0;
    // SE tem lvls e array > 0
    if (!lvlLen[0] && lvlLen[1] > 0) {
      this.progress = this.coment.somaLvls(comm);
      len = lvlLen[1] - 1;
    } else {
      len = lvlLen[1];
    }
    this.comments = [
      Object.keys(comm).slice(0, len),
      Object.values(comm).slice(0, len)
    ];
    this.coment.show = true;
  }

  of(obj, i) {
    return obj[this.newPost === 0 ? (i - 1) : i];
  }

  /*
  * SE post -> retorna title + autor
  * @param title: titulo do post
  * @param author: autor do post
  **/
  parseTitle(title, i, isAut): string {
    const author = this.dreams[i]['author'];
    return author && this.isDream && !isAut ? title :
      (isAut ? this.getAuthor(i) + ':.' : title);
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
    return this.isDream ? this.dreams[id]['author'] :
      (this.isNew(id) ? this.usua : this.dreams[id]['author']);
  }

  /*
  * Posta sonho em nome de user logado
  **/
  onPost(): void {
    const values = [this.title, this.text, this.dreams[0]['img'], new Date().getTime()];
    if (values[0] && values[1]) {
      this.newPost = null;
      this.post.create(this.usua, values);
    } else {
      console.log('Preencha todos os campos');
    }
  }
  writeNew(input?, evt?): void {
    this[input] = evt ? evt.target.value : '';
    if (!this.isDream) {
      if (this.newPost !== 0) {
        this.dreams.unshift({title: '', text: '', img: 0});
        this.newPost = 0;
      }
    } else {
      console.log(this.title, this.text);
    }
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
    if (!this.isDream && !this.isNew(path)) {
      path = `${this.author[0]}/p/${path}`;
      this.user.goTo(path);
    }
  }

  isNew(i): boolean {
    return this.newPost === 0 && i === this.newPost;
  }

  newBack(img): void {
    this.dreams[0]['img'] = img;
  }

  editPost(): void {
    if (this.post.btnEdit === 'Editar') {
      this.post.btnEdit = 'Salvar';
    } else {
      this.coment.show = false;
      const newValues = [
        this.title || this.dreams[0]['title'],
        this.text || this.dreams[0]['text']
      ];
      this.post.update(this.usua, this.id, newValues).then(() => {
        this.post.btnEdit = 'Editar';
        if (!(this.title && this.text)) {
          console.log('Alguns dados mantidos');
        }
        this.coment.show = true;
      });
    }
  }

  delPost(): void {
    this.post.delete(this.usua, this.id)
      .then(() => {
        console.log(this.id, 'post deletado');
        this.user.goTo('');
      });
  }

  editCom(i): void {
    if (!this.coment.btnEdit[i]) {
      this.coment.btnEdit[i] = 'Editar';
    }
    if (this.coment.btnEdit[i] === 'Editar') {
      this.coment.btnEdit[i] = 'Salvar';
    } else {
      const newVal = this.coment.edited || this.comments[1][i].text;
      const comentId = this.comments[0][i];
      this.coment.update(this.id, comentId, newVal);
      this.coment.btnEdit[i] = 'Editar';
      if (this.coment.edited) {
        console.log('Comentario editado');
      } else {
        console.log('Comentario mantido');
      }
    }
  }

  delCom(i): void {
    this.coment.delete(this.id, this.comments[0][i])
      .then(() => console.log(i, 'deletado'));
  }

}
