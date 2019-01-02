import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements OnInit {
  @Input() display = false;
  @Input() warning: string;
  @Input() showLogin = false;
  @Input() logType: string;

  @Output() showH: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() DelC: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor() { }

  ngOnInit() {
  }

}
