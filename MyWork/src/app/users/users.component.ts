import { Component, OnInit } from '@angular/core';
import { UsersService } from '../serverdet/users.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  data : any[];
  sortBy = 'name';
  sortOrder = "asc";
  constructor(private _service : UsersService) { }
 
  ngOnInit() {
     this.getUser();
  }
  getUser(){
    this.data = this._service.getUserdet();
    console.log(this.data);
  }
}
