import { Component, OnInit } from '@angular/core';
import { UsersService } from '../serverdet/users.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  users = [];

  constructor(private _service : UsersService) { }
 
  ngOnInit() {
     this.getUser();
  }
  getUser(){
    this.users = this._service.getUserdet();
    console.log(this.users);
  }
}
