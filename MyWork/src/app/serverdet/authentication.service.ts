import { Injectable } from '@angular/core';

@Injectable()
export class AuthenticationService {

  constructor() { }
  isLoggined(){console.log(localStorage);
    if(localStorage.length > 0){
      return true;
    }else{
      return false;
    }
  }

  logout(){
    localStorage.clear();
  }

  login(user){console.log(user);
    localStorage.setItem("item",JSON.stringify(user));
    //console.log(localStorage.getItem('item'));
  }
}
