import { Injectable } from '@angular/core';

export const user =  [
  {
    "name": "aswani",
    "email": "aswani@gmail.com",
    "age": "25",
    "place": "kozhikode",
    "password": "aswani123"
  },{
    "name": "vishnu",
    "email": "vishnu@gmail.com",
    "age": "27",
    "place": "ernakulam",
    "password": "vishnu123"
  },{
    "name": "devika",
    "email": "devika@gmail.com",
    "age": "25",
    "place": "ernakulam",
    "password": "devika123"
  },{
    "name": "divya",
    "email": "divya@gmail.com",
    "age": "27",
    "place": "ernakulam",
    "password": "divya123"
  },{
    "name": "deepa",
    "email": "deepa@gmail.com",
    "age": "28",
    "place": "ernakulam",
    "password": "deepa123"
  },{
    "name": "rukma",
    "email": "rukma@gmail.com",
    "age": "27",
    "place": "ernakulam",
    "password": "rukma123"
  }];

@Injectable()

export class UsersService {

  constructor() { }
  public static getUserdet():string[]{
    let users:string[]=[];
    for(let list in user){
      users.push(list);
    }
    return users;
  }

  public static getuser(emailval,passwordval){
    var status = 'Not exist';
    for(let i = 0;i<user.length;i++){
      let email = user[i].email;
      let password = user[i].password;
      if(email == emailval && password == passwordval){
        status = 'exist';
        break;
      }
    }
    return status;
  }
}




