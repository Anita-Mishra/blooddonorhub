import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root',
})

export class UserService {

  serviceUrl="http://18.233.101.37:8001/saiyans/api/user/";
  constructor(private http: HttpClient) { }


  getRequesterById(requesterId:any): Observable<any> {
    const headers = { 'content-type': 'application/json'}  
    //const body=JSON.stringify(person);
    console.log(requesterId + "DOnor ID");
    return this.http.get(this.serviceUrl+'getUser/'+requesterId ,{'headers':headers});
  }

}