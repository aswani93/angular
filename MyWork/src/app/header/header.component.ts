import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../serverdet/authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  addclass = true;
  constructor(private auth: AuthenticationService,private router: Router) { }

  ngOnInit() {
    this.addclass = true;
    if(this.router.url === '/adduser'){
      this.addclass = false;
    }
  }
  logout(){
    this.auth.logout();
    
  }
}
