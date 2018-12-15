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
    } else {// Deverá listar
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
    this.post.getPosts(this.usua).subscribe(allPosts => {
      // Limpa armazenadores
      this.dreams = [];
      this.comments = [];
      // Obtendo todos os autores
      this.author = this.usua === '' ? Object.keys(allPosts) : [this.usua];
      // percorre autores separando
      for (const author of this.author) {
        const posts = allPosts[author] || allPosts;
        // id de posts por autor
        this.id = Object.keys(posts).reverse();
        Object.values(posts).reverse().forEach((a, i) => {
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

  /*
  * Verifica e armazena lvls do post aberto
  * comm = comentários deste post
  **/
  storeLvls(comm: object) {
    const lvlLen = this.coment.hasLvls(comm);
    let len = 0;
    // SE tem lvls e tamanho > 0
    if (!lvlLen[0] && lvlLen[1] > 0) {
      this.progress = this.coment.somaLvls(comm);
      len = +lvlLen[1] - 1;
    } else {
      len = +lvlLen[1];
    }
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
  parseTitle(i: number, title?: string): string {
    const author = this.dreams[i]['author'];
    return this.isDream && title ? title :
      (!title ? this.getAuthor(i) + ':.' : title);
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
      (this.isNew(id) ? this.usua : this.dreams[id]['author']);
  }

  /*
  * Posta sonho em nome de user logado
  **/
  onPost(): void {
    if (this.post.title && this.post.text) {
      this.newPost = null;
      this.post.create(this.usua, this.dreams);
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
    if (!this.isDream) {
      if (this.newPost !== 0) {
        this.dreams.unshift({title: '', text: '', img: 0});
        this.newPost = 0;
      }
    } else {
      console.log(this.post.title, this.post.text);
    }
  }

  /*
  * Posta comentário neste post
  **/
  onComment(): void {
    // usa id do post
    this.coment.create(this.id.toString(), [this.usua, this.comment]);
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
    this.post.update(this.usua, this.id, this.dreams[0]);
  }

  delPost(): void {
    this.post.delete(this.usua, this.id.toString())
      .then(() => {
        console.log(this.id, 'post deletado');
        this.user.goTo('');
      });
  }

  editCom(i: number): void {
    this.coment.update(this.id.toString(), i, this.comments);
  }

  /*
  * Apaga comentário
  * @param i = index do comentario
  **/
  delCom(i: number): void {
    this.coment.delete(this.id.toString(), this.comments[0][i])
      .then(() => console.log(i, 'deletado'));
  }

}
