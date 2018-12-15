import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { UserService } from './user.service';
import { Observable } from 'rxjs';

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
  * @param id = id do post
  **/
  getComents(id: string): Observable<any> {
    return this.db.object(`comments/${id}`).valueChanges();
  }

  create(path: string, value: Array<string>): void {
    path = 'comments/' + path;
    const newVal = {
      author: value[0],
      text: value[1]
    };
    this.db.list(path).push(newVal);
  }

  update(id: string, i: number, oldComents: object): void {
    if (!this.btnEdit[i]) {
      this.btnEdit[i] = 'Editar';
    }
    if (this.btnEdit[i] === 'Editar') {
      this.btnEdit[i] = 'Salvar';
    } else {
      const comentId = oldComents[0][i];
      const newValue = {
        text: this.edited || oldComents[1][i].text
      };
      this.db.object(`comments/${id}/${comentId}`).update(newValue)
        .then(() => {
          if (this.edited) {
            console.log('Comentario editado');
          } else {
            console.log('Comentario mantido');
          }
        })
        .catch(err => {
          throw err;
        });
      this.btnEdit[i] = 'Editar';
    }
  }

  /*
  * Atualiza lvl do sonho
  **/
  updateLvl(id: string): void {
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

  delete(id: string, comId: string): Promise<void> {
    return this.db.object(`comments/${id}/${comId}`).remove()
      .catch(err => {
        throw err;
      });
  }

  /*
  * SE é uma lista de coments com lvls
  * @param coments = lista de comentários
  **/
  hasLvls(coments: object): Array<boolean|number> {
    const keysC = Object.keys(coments);
    const len: number = keysC.length;
    // SE até o ultimo for comentario com autor
    const hasComenters = len > 0 ?
      keysC[len - 1] !== 'lvls' : false;
    // retorna [boolean, tamanhoTotal]
    return [hasComenters, +len];
  }

  /*
  * Conta comentários por post
  * @param coments = lista de comentários
  **/
  countComment(coments: object): string {
    const lvlLen = this.hasLvls(coments);
    // SE tem lvls e tamanho > 0 -> diminui tamanho
    const count = (!lvlLen[0] && lvlLen[1] > 0) ? +lvlLen[1] - 1 : lvlLen[1];
    // SE deve ser plural
    const multi = count === 1 ? ' comment' : ' comments';
    return count + multi;
  }

  /*
  * Soma lvls salvos nos comentários
  **/
  somaLvls(com: object): number {
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
