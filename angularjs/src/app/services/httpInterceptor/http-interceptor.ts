import { Injectable, Injector } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/observable/throw'
import 'rxjs/add/operator/catch';
import { Router } from '@angular/router';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { NotificationService,commonMessages} from '../../services/notificationService/NotificationService';

@Injectable()
export class _HttpInterceptor implements HttpInterceptor {
    constructor(private _router: Router,private spinnerService:Ng4LoadingSpinnerService,private notifyPopup:NotificationService) { }
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    //console.log("intercepted request ... ");
    const token: string = sessionStorage.getItem('token');
    // const session: string = localStorage.getItem('session');
    // req = req.clone({ headers: req.headers.set(' Access-Control-Allow-Origin', '*') });

    if (token) {
      req = req.clone({ headers: req.headers.set('Authorization', token), withCredentials: true });
    }
    /* if (session) {
         req = req.clone({ headers: req.headers.set('session-key', session)});
     }*/
    // Clone the request to add the new header.
    if (!req.headers.has('Content-Type')) {
      req = req.clone({ headers: req.headers.set('Content-Type', 'application/json') });
    }

    //send the newly created request
    //console.log(req);
    return next.handle(req)
      .map((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {

          if(event.body && (event.body.msg == 'INVALID_TOKEN' || event.body.msg == 'NEW_SESSION_IN_ACTIVE' || event.body.msg=='SESSION_EXPIRED')){

            sessionStorage.clear();
            document.cookie = "session_key=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
            this._router.navigate(['/']);
            return Observable.throw('error');
          }
          const responsetoken: string = event.headers.get("authorization");
          if (responsetoken) {

            sessionStorage.setItem('token',event.headers.get("authorization"));
            // localStorage.setItem('session',event.headers.get("session-key"));

          }
        } else
          console.info('event =', event, ';');
        return event;

 



      })
      .catch((error, caught) => {
        //intercept the respons error and displace it to the console
        this.notifyPopup.hideLoader('');
        if (error.status === 401) {
          //logout users, redirect to login page
          //this.cookieService.delete('token');
          // this.spinnerService.hide();
          sessionStorage.clear();
          //redirect to the signin page
          this._router.navigate(['/']); //import router class and declare it in the class
          return Observable.throw(error);
        }

        else {
          //this.spinnerService.hide();
          this._router.navigate(['/']);
          sessionStorage.clear();
          //redirect to the signin page
          //import router class and declare it in the class

          return Observable.throw(error);
        }

        //return the error to the method that called it

      }) as any;
  }
}
