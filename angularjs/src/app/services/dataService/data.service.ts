import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { HttpClient } from '@angular/common/http';
import { WebserviceService } from '../commonServices/webservice.service'

@Injectable()
export class DataService {
    constructor(private _http : HttpClient, private service : WebserviceService) { }
    GetData(url){
        return this._http.get(url).map(result => result);
    }
    
   
}
