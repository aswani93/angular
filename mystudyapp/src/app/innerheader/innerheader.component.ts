import { Component, OnInit } from '@angular/core';
import { LoginService } from '../login.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-innerheader',
  templateUrl: './innerheader.component.html',
  styleUrls: ['./innerheader.component.css']
})
export class InnerheaderComponent implements OnInit {

  constructor(private service: LoginService,private router : Router) { }

  ngOnInit() {
  }
  logout(){
    this.service.logout();
    this.router.navigate(['/login']);
  }
}
