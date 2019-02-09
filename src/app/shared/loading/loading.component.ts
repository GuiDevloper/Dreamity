import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss']
})
export class LoadingComponent implements OnInit {
  typed = '';
  pos = 0;
  animNeon = {};
  animDraw = {};
  back = {};
  @Input() loaded = false;

  constructor() { }

  ngOnInit() {
    this.typeWriter('Dreamity');
  }

  typeWriter(txtArray) {
    txtArray = this.loaded ? 'Sonhe.' : 'Dreamity';
    // SE o caractere é menor que o tamanho da frase atual
    if (this.pos < txtArray.length) {
      // Adiciona mais um caractere do texto
      this.typed = txtArray.substr(0, ++this.pos) + '|';
      // Faz callback passando os mesmos dados
      setTimeout(() => {
        this.typeWriter(txtArray);
        // tempo dinamico
      }, this.loaded ? 100 : 150);
    } else {
      this.typed = '';
      // durações dinamicas
      const dur = this.loaded ? [0, 0, 0] : [2, 3, 4000];
      // ativa animações
      this.animNeon['animation'] = !this.loaded ? `vanishIn ${dur[0]}s running` : 'initial';
      this.animDraw['animation'] = !this.loaded ? `draw ${dur[1]}s ${dur[0]}s running` : 'initial';
      // espera fim das animações
      setTimeout(() => {
        if (!this.loaded) {
          // restart
          this.pos = 0;
          this.animNeon = {
            'animation': 'initial',
            'animation-name': 'vanishIn'
          };
          this.animDraw = {
            'animation': 'initial',
            'animation-name': 'draw'
          };
          this.typeWriter(txtArray);
        } else {
          // oculta tudo
          this.back = { opacity: 0 };
          setTimeout(() => {
            this.back = { display: 'none' };
          }, 500);
        }
      }, dur[2]);
    }
  }

}
