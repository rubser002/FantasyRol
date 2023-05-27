import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/authServices/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent {
  error: boolean = false;
  signupForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    user: new FormControl('', [Validators.required, Validators.minLength(4)]),
    password: new FormControl('', [Validators.required, Validators.minLength(8)])
  });

  constructor(
    private authService: AuthService,
    private router: Router,
  ) { }

  register(): void {

    const email = this.signupForm.value.email;
    const name = this.signupForm.value.user;
    const password = this.signupForm.value.password;

    const userPostDto = { email, name, password };

    this.authService.register(userPostDto).subscribe({
      next: (response: any) => {
        this.router.navigate(['/home']);
      },
      error: (error: any) => {
        this.error = true;
        this.signupForm.controls.email.setErrors({ invalid: true });
        this.signupForm.controls.user.setErrors({ invalid: true });
        this.signupForm.controls.password.setErrors({ invalid: true });
      }
    });
  }
}
