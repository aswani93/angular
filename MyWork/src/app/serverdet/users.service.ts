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
  getUserdet():string[]{
    let users:string[]=[];
    for(let list in user){
      users.push(list);
    }
    return users;
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
}




