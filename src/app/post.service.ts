import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  posts: any;
  imgs: Array<string> = [
    'https://i.pinimg.com/564x/26/94/f8/2694f861b9e3fa5cf6f3f4a6bb19f7b5.jpg',
    'https://i.pinimg.com/564x/82/42/c6/8242c639e3e45cf791d061074b562954.jpg',
    'https://i.pinimg.com/564x/fd/b4/23/fdb4234977b0c09e9f078e6025fc1c94.jpg'
  ];
  btnEdit = 'Editar';

  constructor(private db: AngularFireDatabase) { }

  /*
  * Puxa posts baseado no usuario armazenado
  * @param usua: string = username || ''
  **/
  getPosts(usua): Observable<{}> {
    return this.db.object(`posts/${usua}`).valueChanges();
  }

  create(user, value) {
    value = {
      title: value[0],
      text: value[1],
      img: value[2],
      time: value[3]
    };
    this.db.list(`/posts/${user}`).push(value);
  }

  update(user, id, newValue) {
    newValue = {
      title: newValue[0],
      text: newValue[1],
    };
    return this.db.object(`posts/${user}/${id}/`).update(newValue)
      .catch(err => {
        throw err;
      });
  }

  delete(user, id) {
    return this.db.object(`posts/${user}/${id}/`).remove()
      .catch(err => {
        throw err;
      });
  }

  /*
  * Transforma de timestamp para dd/mm/aaaa
  * @param time: timestamp do post
  **/
  getDate(time): string {
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
  * @param timePost: new Date(timestamp)
  **/
  format(timePost): string {
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
