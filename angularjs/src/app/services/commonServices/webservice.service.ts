import {Injectable} from '@angular/core';
import {Http, Headers, RequestOptions, URLSearchParams, Response} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import {commonUrl} from '../urls/common-url';
import {HttpClient, HttpRequest,HttpHeaders} from '@angular/common/http';
import {NotificationService, commonMessages} from '../../services/notificationService/NotificationService';


import 'rxjs/Rx';

@Injectable()
export class WebserviceService {


  constructor(public http: Http, public httpClient: HttpClient, private notifyPopup: NotificationService) {
  }

  public postWeb(url: string, body: Object, options: any): any {
    return new Promise((resolve, reject) => {
      this.httpClient.post(commonUrl.dynamicapi + url, body, options)
        .subscribe(
          data => {
            resolve(data);
          },
          err => {
            this.hideLoader();
            reject(err);
          },
          () => {
             this.hideLoader();
          }
        );
    });
  }

  public putWeb(url: string, body: Object, options: any): any {
    return new Promise((resolve, reject) => {
      this.httpClient.put(commonUrl.dynamicapi + url, body, options)
        .subscribe(
          data => {
            resolve(data);
          },
          err => {
            this.hideLoader();
            reject(err);
          },
          () => {
             this.hideLoader();
          }
        );
    });
  }

  public postfile(url: string, body: FormData): any {

    return new Promise((resolve, reject) => {
      this.httpClient.post(commonUrl.dynamicapi + url, body)
        .subscribe(
          data => {
            resolve(data);
          },
          err => {
            this.hideLoader();
            reject(err);
          },
          () => {
             this.hideLoader();
          }
        );
    });
  }


  public getWeb(url: string, body: Object, options: any): any {
    return new Promise((resolve, reject) => {

      this.httpClient.get(commonUrl.dynamicapi + url, options)
        .subscribe(
          data => {
            // console.log('--------------------------');
            // console.log('--------------------------');
            resolve(data);

          },
          err => {
            //console.log(err);
            this.hideLoader();
            // this.error = true;


            reject(err);
          },
          () => {
             this.hideLoader();

          }
        );
    });
  }


  public deleteWeb(url: string, body: Object): any {
    return new Promise((resolve, reject) => {
      this.httpClient.delete(commonUrl.dynamicapi + url)
        .subscribe(
          data => {
            resolve(data);
          },
          err => {
            this.hideLoader();
            reject(err);
          },
          () => {
             this.hideLoader();
          }
        );
    });
  }


  public postJson(url: string, params: Object) {
    let body = JSON.stringify(params);
    let headers = new Headers({'Content-Type': 'application/json'});
    let options = new RequestOptions({headers: headers});
    return this.postWeb(url, body, options);
  }

  public putJson(url: string, params: Object) {
    let body = JSON.stringify(params);
    let headers = new Headers({'Content-Type': 'application/json'});
    let options = new RequestOptions({headers: headers});
    return this.putWeb(url, body, options);
  }

  public postJsonforBoth(url: string, params: Object, method: string) {
    //console.log(url);
    let body = JSON.stringify(params);
    let headers = new Headers({'Content-Type': 'application/json'});
    let options = new RequestOptions({headers: headers});
    if (method == 'post') {
      return this.postWeb(url, body, options);
    } else {
      return this.putWeb(url, body, options);
    }

  }

  public postWebFiles(url: string, body: FormData, option: any): any {
    return new Promise((resolve, reject) => {
      this.http.post(commonUrl.dynamicapi + url, body, option)
        .subscribe(
          data => {
            resolve(data);
          },
          err => {
            this.hideLoader();
            reject(err);
          },
          () => {
             this.hideLoader();
          }
        );
    });
  }
  public postWebFilesWithprogress(url: string, body: FormData): any {
      const req = new HttpRequest('POST', commonUrl.dynamicapi + url, body,{
        headers: new HttpHeaders({ 'authorization': sessionStorage.getItem('token') }),
        reportProgress: true,        
        withCredentials: true
      });
      
      return this.httpClient.request(req);
    
   
  }

  public postFiles(url: string, params: FormData) {
    let body = JSON.stringify(params);
    let headers = new Headers();
    const token: string = sessionStorage.getItem('token');

    headers.set('Authorization', token);
    let options = new RequestOptions({headers: headers, withCredentials: true});
    return this.postWebFiles(url, params, options);
  }
  public postFilesProgress(url: string, params: FormData) {
    let body = JSON.stringify(params);
   
    return this.postWebFilesWithprogress(url, params);
  }

  public handleError(error: any) {
    // in a real world app, we may send the server to some remote logging infrastructure
    // instead of just logging it to the console

    // console.log(error);
    // this.hideLoader();
    this.hideLoader();
    return Observable.throw('Internal server error');
  }

  hideLoader() {
    this.notifyPopup.hideLoader('');
  }
}
