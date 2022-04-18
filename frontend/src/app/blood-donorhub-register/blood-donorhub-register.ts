import { Input, Component, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import {Auth} from 'aws-amplify';
import { RegisterService } from '../service/blood-donorhub-register-service';

@Component({
  selector: 'register-form',
  templateUrl: './blood-donorhub-register.html',
  styleUrls: ['./blood-donorhub-register.scss']

})

export class RegisterFormComponent {
    registerForm: FormGroup;

    constructor(private router: Router,private registerService:RegisterService){
        this.registerForm = new FormGroup({
            name: new FormControl('', [Validators.required]),
            email: new FormControl('', [Validators.required,Validators.email]),
            bloodGroup: new FormControl('', [Validators.required]),
            age: new FormControl('', [Validators.required]),
            gender:new FormControl('', [Validators.required]),
            password:new FormControl('',[Validators.required]),
            phone_number:new FormControl('',[Validators.required]),
            lastDonatedOn:new FormControl('')
          });
    }

  submit() {
    if(this.registerForm.valid) {
        // redirection based on role. If donor then , lists of requests. if requester then list of donor screen. 
        console.log(this.registerForm.value);

        /* "lastDonatedOn": null,
            "zipcode": "B3J2K9",
            "contactNumber": "+918768986754",
            
            "email": "rose.mishra@gmail.com",
            "name": "Rose The Flower",
            "gender": "F",
            "bloodGroup": "O+",
            "age": 20 */
        
          this.registerService.register(this.registerForm.value).subscribe(res=>{
            const user = Auth.signUp({
              username: this.registerForm.value.email,
              password: this.registerForm.value.password,
              attributes: {
                'email': this.registerForm.value.email,
                'name': this.registerForm.value.name,
                'gender': this.registerForm.value.gender,
                'phone_number': this.registerForm.value.phone_number,
                'custom:bloodGroup': this.registerForm.value.bloodGroup
              }
            }).then(awsRes=>{
              //console.log(" I am success response"+awsRes);
              //console.log({ user });
              alert('User signup completed , please check and verify your email.');
              this.router.navigate(['login']);
            }).catch(e=>{
              alert("Couldn't register. Please try after sometime");
              console.log("hihi error"+e);
            });
           
            
          },err=>{
           // if(err && err.error & err.error.email){
              alert(err.error.email);
           // }
            
           // console.log("error while registering"+JSON.stringify(err));
          });
       

       // alert("Verify your email to login");
       // this.router.navigate(['/login']);
      }
    }

    back(){
        this.router.navigate(['']);
    }

    get form(): { [key: string]: AbstractControl; }
    {
        return this.registerForm.controls;
    }
    
}