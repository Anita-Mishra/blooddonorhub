import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})

export class DonorService {

  serviceUrl="http://18.233.101.37:8001/saiyans/api/donor/";
  constructor(private http: HttpClient) { }


  getAvailableDonors(): Observable<any> {
    const headers = { 'content-type': 'application/json'}  
    //const body=JSON.stringify(person);
    //console.log(reqbdy);
    return this.http.get(this.serviceUrl+'getDonors',{'headers':headers});
  }


  getDonorById(donorId:any): Observable<any> {
    const headers = { 'content-type': 'application/json'}  
    //const body=JSON.stringify(person);
    console.log(donorId + "DOnor ID");
    return this.http.get(this.serviceUrl+'getDonorById/'+donorId ,{'headers':headers});
  }

  getRequesterById(requesterId:any): Observable<any> {
    const headers = { 'content-type': 'application/json'}  
    //const body=JSON.stringify(person);
    console.log(requesterId + "DOnor ID");
    return this.http.get(this.serviceUrl+'getRequesterById/'+requesterId ,{'headers':headers});
  }

}