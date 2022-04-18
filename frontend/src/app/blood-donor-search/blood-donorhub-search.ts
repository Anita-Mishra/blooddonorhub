import { Component } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { RegisterService } from '../service/blood-donorhub-register-service';
import { BloodRequestService } from '../service/blood-donorhub-request-service';
import { DonorService } from '../service/blood-donorhub-donor-service';

@Component({
  selector: 'blood-donor-search',
  templateUrl: './blood-donorhub-search.html'
})

export class BloodDonorHubSearchComponent {
  
  donorTableData:any=[];

  requesterTableData:any=[];

  searchedTxt='';

  //donorTableData:any=[];

  displayedColumns: string[] | undefined;
  dataSource:any;
  loggedIn:any="false";
  tableAction='requester';
  loggedInUser:any="";

  constructor(private router: Router,private donorService:DonorService,private bloodRequestService:BloodRequestService){
  }

  ngOnInit(){
    this.loggedIn=localStorage.getItem('logged_in');
    if(this.loggedIn=='true'){
      // requester list
      this.tableAction='requester';
      this.displayedColumns = [ 'requesterName','requesterId', 'bloodRequired','requesterContactNo','action'];
      console.log(localStorage.getItem('userEmailId')+" Session storage item");
      this.loggedInUser=localStorage.getItem('userEmailId');
      this.getRequestsForDonor();
      //this.dataSource = new MatTableDataSource(this.requesterTableData);
    }else{
      // donorlist
      this.getDonors();
      this.tableAction='donors';
      this.displayedColumns = [ 'name','email','bloodGroup',  'age','gender'];
      this.dataSource = new MatTableDataSource(this.donorTableData);
    }
  }

  getRequestsForDonor(){
    console.log(this.loggedInUser+" Err");
    this.bloodRequestService.getRequestsforDonorById(this.loggedInUser).subscribe((res:any)=>{
      console.log(JSON.stringify(res)+"I ma in requests for donor method");
      if(res && res.length>0){
        this.dataSource = new MatTableDataSource(res);
        
      }else{
        this.dataSource = new MatTableDataSource([]);
      }
      console.log(" Requests for Donorrrrrrr");
      
    });
  }

  getDonors(){
    this.donorService.getAvailableDonors().subscribe((res:any)=>{

      this.dataSource = new MatTableDataSource(res.filter((donor:any)=> donor.email!=this.loggedInUser));
    
    });
  }

  callFilter(){
    this.dataSource=new MatTableDataSource(this.donorTableData.filter((donor:any) => donor.bloodGroup.toLowerCase().includes(this.searchedTxt) || donor.zipCode.toLowerCase().includes(this.searchedTxt)));
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  navigateToRegister(){
    this.router.navigate(['/register']);
  }

  navigateToLogin(){
    this.router.navigate(['/login']);
  }

  updateRequestStatus(status:any,requestBdy:any){
    console.log(JSON.stringify(requestBdy)+" Hello Req body");
    if(status=='approved'){
      requestBdy.action="APPROVED";
      
      this.bloodRequestService.updateBloodRequestStatus(requestBdy).subscribe(res=>{
          alert("request status updated");
      });
    }else{
      requestBdy.action="REJECTED";
      this.bloodRequestService.updateBloodRequestStatus(requestBdy).subscribe(res=>{
        alert("request status updated");
      });
    }
    
  }

  reject(){

  }

  navigateToRequest(donorId:any){
    this.router.navigate(['./requestBlood',donorId]);
  }

  logout(){
    localStorage.clear();
    this.router.navigate(['']);
  }

  displayDonorsData(){
    
    this.tableAction='donors';
  this.displayedColumns = [ 'name','email','bloodGroup',  'age','gender','action'];
    this.getDonors();
    
  }

  displayRequesterData(){
    this.tableAction='requester';
    this.displayedColumns = [ 'requesterName','requesterId', 'bloodRequired','requesterContactNo','action'];
    this.getRequestsForDonor();
  }
   
}
