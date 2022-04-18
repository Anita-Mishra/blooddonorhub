import { Component } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'blood-donor-homepage',
  templateUrl: './blood-donorhub-homepage.html'
})

export class BloodDonorHomepageComponent {

    constructor(private router: Router){}

    navigateMe(){
        this.router.navigate(['/search']);
    }
}
