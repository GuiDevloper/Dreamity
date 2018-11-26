import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  posts: any;

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
      time: value[2]
    };
    this.db.list(`/posts/${user}`).push(value);
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
    const minutos = this.n(tempodoPost / 60000);
    const horas = this.n(minutos / 60);
    const dias = this.n(horas / 24);
    return dias ? `Há ${dias} dias.` :
      (horas ? `Há ${horas} horas.` :
      (minutos ? `Há ${minutos} minutos.` : 'Agora a pouco.'));
  }

  /*
  * Normaliza pra inteiro caso fracionado
  * @param time: min/hor/dia possivelmente
  * fracionado após divisão
  **/
  n(time): number {
    time += '';
    // remove tudo após virgula
    return time > 0 ? (time.substring(
      0, time.indexOf('.')) || time) : false;
  }

}
