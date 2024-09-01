import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService, UserDTO } from '../services/auth.service';
import { Router } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule, 
    CommonModule,
  ],
})
export class AuthComponent implements OnInit {
  loginForm: FormGroup;
  registerForm: FormGroup;
  isLoginView: boolean = true;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });

    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  toggleView() {
    this.isLoginView = !this.isLoginView;
  }

  ngOnInit(): void {}

  onLoginSubmit() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      this.authService.login(email, password).subscribe(
        (response: any) => {
          console.log('Login successful', response);
          // Store user information in session storage
          localStorage.setItem('user', JSON.stringify(response));
          // Handle successful login, e.g., store token and navigate
          this.router.navigate(['/angular/todo']);
          alert("Login successful");
        },
        error => {
          console.error('Login failed', error);
        }
      );
    }
  }

  onRegisterSubmit() {
    if (this.registerForm.valid) {
      const { email, password } = this.registerForm.value;
      console.log("register",this.registerForm.value);
      this.authService.register(email, password).subscribe(
        (response: any) => {
          console.log('Registration successful', response);
          this.toggleView();
          alert("Registration successful");
          // Handle successful registration, e.g., store token and navigate
        },
        error => {
          console.error('Registration failed', error);
        }
      );
    }
  }

  // onGoogleLogin() {
  //   // Assuming you have a method to get the Google token
  //   this.getGoogleToken().then(tokenId => {
  //     this.authService.googleLogin(tokenId).subscribe(
  //       (response: UserDTO) => {
  //         console.log('Google login successful', response);
  //         // Handle successful Google login, e.g., store token and navigate
  //         this.router.navigate(['/dashboard']);
  //       },
  //       error => {
  //         console.error('Google login failed', error);
  //       }
  //     );
  //   }).catch(error => {
  //     console.error('Google login failed', error);
  //   });
  // }

  // private getGoogleToken(): Promise<string> {
  //   // Implement the logic to get the Google token here
  //   return new Promise((resolve, reject) => {
  //     // Example: Using Google Sign-In API
  //     gapi.auth2.getAuthInstance().signIn().then(googleUser:user => {
  //       const tokenId = googleUser.getAuthResponse().id_token;
  //       resolve(tokenId);
  //     }).catch(error => {
  //       reject(error);
  //     });
  //   });
  // }
}