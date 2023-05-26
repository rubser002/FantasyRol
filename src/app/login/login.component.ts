import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { Router } from '@angular/router';
import { AuthService } from '../services/authServices/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginForm = new FormGroup({
    email: new FormControl('', Validators.required),
    password: new FormControl('', [Validators.required, Validators.minLength(5)])
  });

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  login(): void {
    if (this.loginForm.invalid) {
      return;
    }

    const email = this.loginForm.value.email;
    const password = this.loginForm.value.password;

    const userPostDto = { email, password };

    this.authService.login(userPostDto).subscribe({
      next: (response: any) => {
        const token = response.token;
        this.router.navigate(['/home']);

      },
      error: (error: any) => {
        console.log(error)
      }
    });
  }
  
}
