import { Injectable } from '@angular/core';

@Injectable()
export class AuthenticationService {

  constructor() { }
  isLoggined(){
    if(localStorage.length > 0){
      return true;
    }else{
      return false;
    }
  }

  logout(){
    localStorage.clear();
  }

  login(user){
    localStorage.setItem("item",JSON.stringify(user));
    //console.log(localStorage.getItem('item'));
  }
}
