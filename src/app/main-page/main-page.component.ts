import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss']
})
export class MainPageComponent implements OnInit {
  posts = [
    {author: 'GuiDevloper', post: 'The post of Welcome'},
    {author: 'GuiDevloper', post: 'The post of Welcome'},
    {author: 'GuiDevloper', post: 'The post of Welcome'},
    // tslint:disable-next-line:max-line-length
    {author: 'GuiDevloper', post: 'The post of Welcome  The post of Welcome  The post of Welcome  The post of Welcome  The post of Welcome  The post of Welcome  The post of Welcome  The post of Welcome  The post of Welcome  The post of Welcome  The post of Welcome  The post of Welcome  The post of Welcome  The post of Welcome  The post of Welcome  The post of Welcome  The post of Welcome  The post of Welcome  The post of Welcome  The post of Welcome  The post of Welcome  The post of Welcome  The post of Welcome  The post of Welcome  The post of Welcome  The post of Welcome  The post of Welcome  The post of Welcome  The post of Welcome  The post of Welcome  The post of Welcome  The post of Welcome  The post of Welcome  The post of Welcome  The post of Welcome  The post of Welcome'}
  ];

  constructor() { }

  ngOnInit() {
  }

}
