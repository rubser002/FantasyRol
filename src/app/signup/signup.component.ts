import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import * as bootstrap from 'bootstrap';
import { AuthService } from '../services/authServices/auth.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent {
  email: string='';
  password: string='';
  user: string='';

  constructor(
    private authService: AuthService,
    private router: Router,

    ) { }


  ngAfterViewInit() {
    // Initialize Bootstrap tooltip
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
      return new bootstrap.Tooltip(tooltipTriggerEl);
    });
  } 

  register() {
    const user = { email: this.email, user: this.user, password: this.password };
    this.authService.register(user).subscribe({
      next: (response: any) => {
      this.router.navigate(['/home']);

      },
      error: (error: any) => {
        
      }
    });
  }
  
  
}
