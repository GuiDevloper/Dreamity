import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  coments: Array<object> = [];
  show = false;
  edited: string;
  btnEdit: Array<string> = ['Editar'];
  // lvl de imagination
  lvl: number = null;

  constructor(private db: AngularFireDatabase,
    private user: UserService) { }

  /*
  * Puxa comentários deste post
  * @param id: string = id do post
  **/
  getComents(id): any {
    const comData = this.db.object(`comments/${id}`).valueChanges();
    return comData;
  }

  create(path, value) {
    path = 'comments/' + path;
    value = {
      author: value[0],
      text: value[1]
    };
    this.db.list(path).push(value);
  }

  update(id, comId, newValue) {
    newValue = {
      text: newValue
    };
    this.db.object(`comments/${id}/${comId}`).update(newValue)
      .catch(err => {
        throw err;
      });
  }

  /*
  * Atualiza lvl do sonho
  **/
  updateLvl(id) {
    this.user.isLogged().subscribe(use => {
      const name = this.user.getUser(use.uid)[0];
      const newVal = {};
      newVal[name] = this.lvl;
      this.db.object(`comments/${id}/lvls`).update(newVal)
        .catch(err => {
          throw err;
      });
    });
  }

  delete(id, comId) {
    return this.db.object(`comments/${id}/${comId}`).remove()
      .catch(err => {
        throw err;
      });
  }

  /*
  * SE é uma lista de coments com lvls
  * @param coments: lista de comentários
  **/
  hasLvls(coments) {
    coments = Object.keys(coments);
    const len = coments.length;
    // SE até o ultimo for comentario com autor
    const hasComenters = len > 0 ?
      coments[len - 1] !== 'lvls' : false;
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
    const lvls = Object.values(com['lvls']);
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
