import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RequestBloodFormComponent } from './blood-donor-request-form/blood-donor-request-form';
import { BloodDonorHubSearchComponent } from './blood-donor-search/blood-donorhub-search';
import { BloodDonorHomepageComponent } from './blood-donorhub-homepage/blood-donorhub-homepage';
import { LoginFormComponent } from './blood-donorhub-login/blood-donorhub-login';
import { RegisterFormComponent } from './blood-donorhub-register/blood-donorhub-register';


const routes: Routes = [
  { path: 'search', component: BloodDonorHubSearchComponent }, 
  { path: '', component: BloodDonorHomepageComponent },
  { path: 'home', component: BloodDonorHomepageComponent },
  { path: 'login', component: LoginFormComponent },
  { path: 'search', component: BloodDonorHubSearchComponent },
  { path: 'register', component: RegisterFormComponent },
  { path: 'requestBlood/:donorId', component: RequestBloodFormComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }