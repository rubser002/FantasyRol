import {Component, Input, OnInit} from '@angular/core';

import { NavComponent } from '../nav/nav.component';
import { AuthService } from '../services/authServices/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],

})
export class LayoutComponent implements OnInit {
  @Input()user!: string;
  isloggedin:boolean=false
  constructor(private auth: AuthService,private router : Router){

  }
  async ngOnInit(): Promise<void> {

    if(!await this.auth.isLoggedIn()){
      
      this.router.navigate(['/login']);
    }else{
      this.isloggedin=true;
    }
  }

  
}
