import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})

export class RegisterService {

  serviceUrl="http://18.233.101.37:8001/saiyans/api/user/";
  constructor(private http: HttpClient) { }


  register(reqbdy:any): Observable<any> {
    const headers = { 'content-type': 'application/json'}  
    //const body=JSON.stringify(person);
    console.log(reqbdy);
    return this.http.post(this.serviceUrl+'createUser' ,reqbdy,{'headers':headers});
  }

}