import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';



@Injectable()
export class UserserviceService {

  constructor(private http: HttpClient) { }
  
 checkLogin(user):any{
    return new Promise ((resolve,reject) => {
      this.http.post('http://sbdevv2.silverbullet.in:80/api/public/Discourse/login?api_key=8d34e0a5f0700c4049f1e83b0836dd31',user)
      .subscribe(
        data =>{
          resolve(data);
        },
        err => {
          reject(err);
        }
      )
    });
  }

  getList(){
    return new Promise((resolve,reject) => {
      this.http.get('http://sbdevv2.silverbullet.in:80/api/public/Discourse/flaggedmessages?api_key=8d34e0a5f0700c4049f1e83b0836dd31')
      .subscribe(
        data => {
          console.log(data);
          resolve(data || {});
        },err => {
          reject(err);
        }
      )
    })
  }

  getQuestiondetails(id){
    return new Promise((resolve,reject) => {
      this.http.get('http://sbdevv2.silverbullet.in:80/api/public/Discourse/eachflaggedmessage/'+id+'?api_key=8d34e0a5f0700c4049f1e83b0836dd31')
      .subscribe(
        data =>{
          resolve(data || {})
        },
        err =>{
          reject(err);
        }
      )
    })
  }
}
