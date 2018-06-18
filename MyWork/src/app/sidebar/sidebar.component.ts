import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  users = [];
  
  constructor() { }

  ngOnInit() {
   this.users =  this.transform(localStorage.getItem('item'));
   console.log(this.users);
  }
  transform(value) {
    return typeof value==='string' ? JSON.parse(value.replace(/'/g, '"')) : value;
}
}
