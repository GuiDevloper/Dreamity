import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs';
import { CommentService } from './comment.service';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  posts: any;
  // Dados do sonho postado
  title = '';
  text = '';
  imgs: Array<string> = [
    // Neon asian car & womans
    'https://i.pinimg.com/564x/80/7a/8e/807a8e5dcf9f9d271c6169dde744fdc7.jpg',
    // 'What you lookin' at?'
    'https://i.pinimg.com/564x/e4/bf/d1/e4bfd1a215db2597e0e4bbb5b50eee6e.jpg',
    // Pink neon, car in night, japan letters
    'https://i.pinimg.com/564x/80/4a/4f/804a4fba590dd8b2bbd07d18874e7f26.jpg',
    // Rocket neon & planets
    'https://i.pinimg.com/564x/ba/b8/41/bab8416853a41c124d3e676c3235b9e3.jpg',
    // Corridor at star night
    'https://i.pinimg.com/564x/e9/ca/ec/e9caec56baa056999d6640d2f5bf1bc1.jpg',
    // Skyscrapers w/ 'night' neon
    'https://i.pinimg.com/564x/bb/62/5d/bb625da66ba6d72de6179da368c0d92f.jpg',
    // Palm tree w/ moon behind
    'https://i.pinimg.com/originals/fd/dd/b3/fdddb3aeec85d379258cf73246d667fd.gif',
    // Sea infinite above & below
    'https://i.pinimg.com/originals/a5/44/37/a54437ac46138cc2cca8da78ed0cba29.gif'
  ];
  btnEdit = 'Editar';

  constructor(private db: AngularFireDatabase,
    private coment: CommentService) { }

  /*
  * Puxa posts baseado no usuario armazenado
  * @param usua = username || ''
  **/
  getPosts(usua: string): Observable<{}> {
    return this.db.object(`posts/${usua}`).valueChanges();
  }

  create(user: string, value: Array<object>): Promise<any> {
    return new Promise(resolve => {
      const newVal = {
        title: this.title.trim(),
        text: this.text.trim(),
        img: value[0]['img'],
        time: new Date().getTime()
      };
      if (newVal.title !== '' && newVal.text !== '' && newVal.img) {
        return this.db.list(`/posts/${user}`).push(newVal)
          .then(() => resolve(null));
      } else {
        resolve('Digitou o seu sonho todo e escolheu o fundo?');
      }
    });
  }

  update(user: string, id, newDream: object): any | Promise<any> {
    this.coment.show = false;
    if (this.btnEdit === 'Editar') {
      this.btnEdit = 'Salvar';
      this.coment.show = true;
      return null;
    } else {
      return new Promise(resolve => {
        const title = this.title, txt = this.text;
        const newVal = {
          title: title || newDream['title'],
          text: txt || newDream['text']
        };
        this.db.object(`posts/${user}/${id}/`).update(newVal)
          .then(() => {
            this.btnEdit = 'Editar';
            if (!(title && txt)) {
              const empT = title ? '' : 'Título';
              let empTxt = empT ? ' e texto do Sonho' : 'Texto do Sonho';
              empTxt = txt ? empT : empT + empTxt;
              resolve(`${empTxt} mantido${!title && !txt ? 's' : ''}`);
            } else {
              resolve(null);
            }
          })
          .catch(err => {
            resolve(err);
          });
      });
    }
  }

  delete(user: string, id: string): Promise<void> {
    this.coment.delete(id, '');
    return this.db.object(`posts/${user}/${id}/`).remove()
      .catch(err => {
        throw err;
      });
  }

  restart(dream: object): void {
    this.title = dream['title'];
    this.text = dream['text'];
  }

  /*
  * Transforma de timestamp para dd/mm/aaaa
  * @param time = timestamp do post
  **/
  getDate(time: number): string {
    const timePost = new Date(time);
    // params de formatação
    const options = {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric'
    };
    // formatado + tempo visual
    return timePost.toLocaleDateString(undefined, options) +
      ' ' + this.format(timePost);
  }

  /*
  * Formata time pra `Há ${tantos} min/horas/dias`
  * @param timePost = new Date(timestamp)
  **/
  format(timePost: Date): string {
    // Obtem há quanto tempo foi postado
    const tempodoPost = new Date().getTime() - timePost.getTime();
    const minutos = Math.floor(tempodoPost / 60000);
    const horas = Math.floor(minutos / 60);
    const dias = Math.floor(horas / 24);
    return dias ? `Há ${dias} dias.` :
      (horas ? `Há ${horas} horas.` :
      (minutos ? `Há ${minutos} minutos.` : 'Agora a pouco.'));
  }

}
