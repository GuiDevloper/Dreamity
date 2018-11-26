import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  coments: Array<object> = [];

  constructor(private db: AngularFireDatabase) { }

  /*
  * Puxa comentários deste post
  * @param id: string = id do post
  **/
  getComents(id, i): any {
    if (this.coments[i]) {
      return [this.coments[i], true];
    } else {
      const comData = this.db.list(`comments/${id}`).valueChanges();
      comData.subscribe(use => {
        this.coments.push(use);
      });
      return [comData, false];
    }
  }

  create(path, value) {
    path = 'comments/' + path;
    value = {
      author: value[0],
      text: value[1]
    };
    this.db.list(path).push(value);
  }

  update(id, value) {
    this.db.object(`comments/${id}/lvls`).update(value);
  }

  /*
  * SE é uma lista de coments com lvls
  * @param coments: lista de comentários
  **/
  hasLvls(coments) {
    const len = coments.length;
    // SE até o ultimo for comentario com autor
    const hasComenters = len > 0 ?
      Object.keys(coments[len - 1])[0] === 'author' : false;
    // retorna [boolean, tamanhoTotal]
    return [hasComenters, len];
  }

  /*
  * Conta comentários por post
  * @param coments: lista de comentários
  **/
  countComment(coments) {
    const lvlLen = this.hasLvls(coments);
    // SE tem lvls e tamanho > 0 -> diminui tamanho
    const count = !lvlLen[0] && lvlLen[1] > 0 ? lvlLen[1] - 1 : lvlLen[1];
    // SE deve ser plural
    const multi = count === 1 ? ' comment' : ' comments';
    return count + multi;
  }

  somaLvls(com) {
    const lvls = Object.values(com.pop());
    let soma: any = 0, index = 1;
    // percorre lvls calculado
    lvls.forEach((element, i) => {
      soma += element;
      index += i;
    });
    // exibe dividindo por qtd
    return soma / index;
  }

}
