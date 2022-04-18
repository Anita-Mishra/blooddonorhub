import { Input, Component, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DonorService } from '../service/blood-donorhub-donor-service';
import { BloodRequestService } from '../service/blood-donorhub-request-service';
import { UserService } from '../service/blood-donorhub-user-service';

@Component({
  selector: 'request-blood-form',
  templateUrl: './blood-donor-request-form.html',
  styleUrls: ['./blood-donor-request-form.scss']

})

export class RequestBloodFormComponent {
  requestBloodForm: FormGroup;
  donorId:any;
  requeserterUserId:any;
  donorDetails:any;
  requesterDetails:any;
    constructor(private router: Router,private bloodRequestService:BloodRequestService,private route: ActivatedRoute,
      private donorService:DonorService,private usrService:UserService){

        this.requestBloodForm = new FormGroup({
          requesterId: new FormControl({value:'', disabled: true}, [Validators.required]),
          requesterContactNo: new FormControl({value:'', disabled: true}, [Validators.required]),
          donorId: new FormControl({value:'', disabled: true}, [Validators.required]),
          donorContactNo: new FormControl({value:'', disabled: true}, [Validators.required]),
          action: new FormControl('REQUESTED', [Validators.required]),
          preferredDate:new FormControl('', [Validators.required]),
          bloodRequired:new FormControl({value:'', disabled: true},[Validators.required])
        });
    }

    ngOnInit(){
      this.requeserterUserId=localStorage.getItem("userEmailId");
      this.route.params.subscribe((params: any) => {
              if(params.donorId){
                this.donorId=params.donorId;
                console.log(this.donorId+" Hello Js");
                
                this.getRequesterDetailsById();
                this.getDonorDetailsById();
              }

      });
    }

    //  this is needed to have prior details of requester for generating request BODY
    getRequesterDetailsById(){
      this.usrService.getRequesterById(this.requeserterUserId).subscribe((res:any)=>{
        console.log("requesterId requester"+JSON.stringify(res));
        if(res && res.Item){
          this.requesterDetails=res.Item;
          console.log(JSON.stringify(this.requesterDetails)+"Res Contatc number ");
          this.requestBloodForm.patchValue({
            requesterId:this.requesterDetails.email,
            requesterContactNo:this.requesterDetails.phone_number
          });
        }
        
      });
    }


    //  this is needed to have prior details of donor for generating request BODY
    getDonorDetailsById(){
      this.donorService.getDonorById(this.donorId).subscribe((res:any)=>{
        console.log("Res Donor"+res );
        if(res && res.Item){
          this.donorDetails=res.Item;
          this.requestBloodForm.patchValue({
            donorId:this.donorDetails.email,
            donorContactNo:this.donorDetails.phone_number,
            bloodRequired:this.donorDetails.bloodGroup
          });
        }
        console.log(JSON.stringify(this.donorDetails)+" Donor DEtails");
        
      });
    }


    // submits to generate request form
  submit() {
    if(this.requestBloodForm.valid) {
        // redirection based on role. If donor then , lists of requests. if requester then list of donor screen. 
        let reBdy={
            donorId:this.donorDetails.email,
            donorContactNo:this.donorDetails.phone_number,
            bloodRequired:this.donorDetails.bloodGroup,
            requesterId:this.requesterDetails.email,
            requesterContactNo:this.requesterDetails.phone_number, 
            requesterName:this.requesterDetails.name
        };

        Object.assign(reBdy,this.requestBloodForm.value);

        this.bloodRequestService.bloodRequest(reBdy).subscribe(res=>{
          alert('Requested for blood successfully!');
          
        },err=>{
          // console.log("error while registering"+err);
        });
      }
    }

    
    back(){
        this.router.navigate(['']);
    }

    get form(): { [key: string]: AbstractControl; }
    {
        return this.requestBloodForm.controls;
    }
    
}