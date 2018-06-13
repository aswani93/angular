import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Http, Headers, RequestOptions, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../environments/environment'

@Injectable()
export class CommonserviceService {
  private commonUrl: string;

  constructor(private http: HttpClient) {
    this.commonUrl = `${environment.api.host}:${environment.api.port}${environment.api.api}`;
   }
  public postWeb(url: string, body: Object, options: any): any {
          return new Promise((resolve, reject) => {
              
              this.http.post(this.commonUrl + url, body, options)
                  .subscribe(
                  data => {
                      resolve(data);
                  },
                  err => {
                      reject(err);
                  },
                  () => {
                  }
                  );
               
                
         
          });
      }
  public getWeb(url: string, body: Object, options: any,showLoader?:boolean): any {

      return new Promise((resolve, reject) => {

        this.http.get(this.commonUrl + url, options)
              .subscribe(
              data => {
                  resolve(data);
              },
              err => {
                  console.log(err);
                  
                  //this.error = true;
                  

                  reject(err);
              },
              () => {

                  
              }
              );
      });
  }
  
  public deleteRequest(url: string, body: Object, options: any): any {
  return new Promise((resolve, reject) => {

      this.http.delete(environment.api + url, options)
          .subscribe(
          data => {
              resolve(data);
          },
          err => {
              
              // this.error = true;
              

              reject(err);
          },
          () => {

              
          }
          );
  });
}
  
      public handleError(error: any) {
          // in a real world app, we may send the server to some remote logging infrastructure
          // instead of just logging it to the console
        
          // console.log(error);
          // this.hideLoader();
          return Observable.throw('Internal server error');
      }
  
      public postJson(url: string, params: Object) {
          let body = JSON.stringify(params);
          let headers = new Headers({ 'Content-Type': 'application/json' });
          let options = new RequestOptions({ headers: headers });
          return this.postWeb(url, body, options);
      }

}
