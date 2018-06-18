import { LoginUsers } from './data-model';
export const user =  [
  {
    "id" : 1,
    "name": "aswani",
    "email": "aswani@gmail.com",
    "age": "25",
    "place": "kozhikode",
    "password": "aswani123"
  },{
    "id" : 2,
    "name": "vishnu",
    "email": "vishnu@gmail.com",
    "age": "27",
    "place": "ernakulam",
    "password": "vishnu123"
  },{
    "id" : 3,
    "name": "devika",
    "email": "devika@gmail.com",
    "age": "25",
    "place": "ernakulam",
    "password": "devika123"
  },{
    "id" : 4,
    "name": "divya",
    "email": "divya@gmail.com",
    "age": "27",
    "place": "ernakulam",
    "password": "divya123"
  },{
    "id" : 5,
    "name": "deepa",
    "email": "deepa@gmail.com",
    "age": "28",
    "place": "ernakulam",
    "password": "deepa123"
  },{
    "id" : 6,
    "name": "rukma",
    "email": "rukma@gmail.com",
    "age": "27",
    "place": "ernakulam",
    "password": "rukma123"
  }];

export class UsersService {
  constructor() { }
  getUserdet(){
    return user;
  }

  getuser(emailval,passwordval){
    var userslist = [
      {
        "status": 'Not_exist',
        "id":  0,
        "name" :  '', 
        "email" : ''
      }
    ];

   
    for(let i = 0;i<user.length;i++){
      let email = user[i].email;
      let password = user[i].password;
      if((email == emailval) && (password == passwordval)){
        var userslist = [
          {
            "status": 'exist',
            "id":  user[i].id,
            "name" :  user[i].name,
            "email" : user[i].email
          }
        ];
        break;
      }
    }
    return userslist;
  }

  postuser(value){
    console.log(value.email);
    if(this.checkuser(value.email) == 'Not_exist'){
      user.push(value);
      console.log(user);
      return 1;
    }else{
      return 0;
    }
  }


  checkuser(emailval){
    var userslist = 'Not_exist';
    for(let i = 0;i<user.length;i++){
      let email = user[i].email;
      let password = user[i].password;
      if(email == emailval){
        var userslist = 'exist';
        break;
      }
    }
    return userslist;
  }
}




