import { Injectable } from '@angular/core';

@Injectable()
export class LoginService {

  constructor() { }
  isLoggedin(){
   
    if(localStorage.length > 0){
      return true;
    }else{
      
      return false;
    }
  }
  logout(){
    localStorage.clear();
  }
}
