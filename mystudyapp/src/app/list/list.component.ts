import { Component, OnInit, Input } from '@angular/core';
import { LoginService } from '../login.service';
import {UserserviceService } from '../userservice.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {
  
  constructor(private service: LoginService,private userservice :UserserviceService,private router: Router) { 
    this.getquestions();
  }
  List : any;
  status = false;
  ngOnInit() {
    console.log(localStorage);
    

  }

  
  getquestions(){
   /* var response = this.userservice.getList();
    response.then(res =>{
      this.status = true;
      console.log(res);
      this.List = res['flaggedmessages'];
      for(let list of this.List){
        list.question = atob(list.question);
      }
    })*/
    
  }
  readMore(id){
   
    this.router.navigate(['list/'+id]);
  }
}
