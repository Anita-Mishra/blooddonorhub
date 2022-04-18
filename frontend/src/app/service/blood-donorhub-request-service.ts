import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})

export class BloodRequestService {

  serviceUrl="http://18.233.101.37:8001/saiyans/api/requests/";
  constructor(private http: HttpClient) { }



  bloodRequest(bloodReqbdy:any): Observable<any> {
    const headers = { 'content-type': 'application/json'}  
    //const body=JSON.stringify(person);
    console.log(bloodReqbdy + "requestBdy ID");
    return this.http.post(this.serviceUrl+'createRequests/' ,bloodReqbdy,{'headers':headers});
  }

  updateBloodRequestStatus(bloodReqbdy:any): Observable<any> {
    const headers = { 'content-type': 'application/json'}  
    //const body=JSON.stringify(person);
    console.log(bloodReqbdy + "requestBdy ID");
    return this.http.put(this.serviceUrl+'updateRequestStatus/' ,bloodReqbdy,{'headers':headers});
  }

  
  getRequestsforDonorById(donorId:any){
    const headers = { 'content-type': 'application/json'}  
    //const body=JSON.stringify(person);
    console.log(donorId + "requestBdy ID");
    return this.http.get(this.serviceUrl+'getRequestForDonorID/'+donorId,{'headers':headers});
  }

}