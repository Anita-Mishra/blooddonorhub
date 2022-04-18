import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import Amplify, { Auth } from 'aws-amplify';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material/material.module';
import { BloodDonorHubSearchComponent } from './blood-donor-search/blood-donorhub-search';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BloodDonorHomepageComponent } from './blood-donorhub-homepage/blood-donorhub-homepage';
import { LoginFormComponent } from './blood-donorhub-login/blood-donorhub-login';
import { RegisterFormComponent } from './blood-donorhub-register/blood-donorhub-register';
import { HttpClientModule } from '@angular/common/http';
import { RequestBloodFormComponent } from './blood-donor-request-form/blood-donor-request-form';


Amplify.configure({
    Auth:{
      mandatorySignIn:true,
      region: 'us-east-1',
      userPoolId: 'us-east-1_90G4noBiQ',
      userPoolWebClientId: '2htssvcs2nu1dkmjo4j6f511lo',
      authenticationFlowType:'USER_PASSWORD_AUTH'
    }
  });

@NgModule({
  declarations: [
    AppComponent,
    BloodDonorHubSearchComponent,
    BloodDonorHomepageComponent,
    LoginFormComponent,
    RegisterFormComponent,
    RequestBloodFormComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
