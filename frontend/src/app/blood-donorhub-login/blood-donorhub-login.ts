import { Input, Component, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { Auth } from 'aws-amplify';

@Component({
  selector: 'login-form',
  templateUrl: './blood-donorhub-login.html',
  styleUrls: ['./blood-donorhub-login.scss']

})

export class LoginFormComponent {
    loginForm: FormGroup;
    constructor(private router: Router){
        this.loginForm = new FormGroup({
            email: new FormControl('', [Validators.required, Validators.email]),
            password: new FormControl('', [Validators.required])
          });
    }

  async submit() {
    if(this.loginForm.valid) {
        // redirection based on role. If donor then , lists of requests. if requester then list of donor screen. 
        console.log(this.loginForm.value);
        try {
              let user = await Auth.signIn(this.loginForm.value.email.toString(), this.loginForm.value.password.toString());
              console.log(user+"  User detaikls");
              let tokens = user.signInUserSession;
              if (tokens != null) {
                console.log('User authenticated');
                alert('You are logged in successfully !');
                localStorage.setItem('logged_in',"true");
                localStorage.setItem('userEmailId',this.loginForm.value.email);
                this.router.navigate(['/search']);
              }
            } catch (error:any) {
              console.log(error.message);
              this.router.navigate(['/search']);
             localStorage.setItem('logged_in',"false");
             //sessionStorage.setItem('userEmailId',this.loginForm.value.email);
              alert('User Authentication failed! '+error.message);
            }
        
      }
    }

    get form(): { [key: string]: AbstractControl; }
    {
        return this.loginForm.controls;
    }

    back(){
      this.router.navigate(['']);
    }
    
}