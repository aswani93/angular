import { Injectable } from '@angular/core';
import { Router} from '@angular/router';
@Injectable()
export class AuthenticationService {

  constructor(private router:Router) { }
  isLoggined(){
    if(localStorage.length > 0){
      return true;
    }else{
      return false;
    }
  }

  logout(){
    localStorage.clear();
    this.router.navigate(['/']);
    return false
  }

  login(user){
    localStorage.setItem("item",JSON.stringify(user));
    //console.log(localStorage.getItem('item'));
  }
}
