import { Component, OnInit } from '@angular/core';
import {AuthenticationService } from '../../services/authentication.service';
import {Router} from '@angular/router';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService) { }

  ngOnInit() {
  }
  Logout() {
    
        this.authenticationService.logout()
       
         this.router.navigate(['/']);
   
      //var username = this.model.username;
    
    }
}