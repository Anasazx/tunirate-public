import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/authService/auth.service';

import {
  SocialAuthService,
  GoogleSigninButtonDirective
} from '@abacritt/angularx-social-login';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    GoogleSigninButtonDirective
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {

  loading = false;
  error: string | null = null;

  constructor(
    private authService: AuthService,
    private router: Router,
    private socialAuthService: SocialAuthService
  ) {}

  ngOnInit(): void {
    this.socialAuthService.authState.subscribe(user => {
      if (!user) return;

      this.loading = true;

      this.authService.googleLogin().subscribe({
        next: () => {
          this.loading = false;
          this.router.navigate(['/']);
        },
        error: (err) => {
          this.loading = false;
          console.error(err);
          this.error = 'Google login failed';
        }
      });
    });
  }

  onSubmit(email: string, password: string, event: Event) {
    event.preventDefault();
    this.error = null;

    if (!email || !password) {
      this.error = 'Email and password are required.';
      return;
    }

    this.loading = true;

    this.authService.login({ email, password }).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/']);
      },
      error: (err) => {
        this.loading = false;
        this.error =
          err?.error?.message ||
          err?.message ||
          'Login failed';
      }
    });
  }
}
