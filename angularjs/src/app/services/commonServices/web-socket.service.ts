import { Observable, Observer } from 'rxjs/Rx';
export class WebSocketService {
  ws: WebSocket;
  observer: Observer<any>;
  constructor() { }
  /**Create And Establish Connection Socket */
  createObservableSocket(url: string): Observable<any> {
    // try {
      this.ws = new WebSocket(url);
      return new Observable(
        Observer => {
          this.ws.onmessage = (event) => Observer.next(event.data);
          this.ws.onerror = (event) => Observer.error(event);
          this.ws.onclose = (event) => {
            Observer.complete()
            return new Observable()
          };
        }
      )
    // }
    // catch(e){
    //   console.log("")
    // }
   
  }
  /**Send Data TO Server via Sockets */
  sendMessage(message: any) {
    this.ws.send(message);
  }
}
