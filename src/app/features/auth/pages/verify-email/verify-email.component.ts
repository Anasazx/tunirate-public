import {Component, ElementRef, OnInit, QueryList, ViewChildren} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgForOf, NgIf } from '@angular/common';
import {ActivatedRoute, Router} from '@angular/router';

import { AuthService } from '../../services/authService/auth.service';
import { EmailVerificationService } from '../../../../core/services/EmailVerificationService/email-verification.service';


@Component({
  selector: 'app-verify-email',
  standalone: true,
  imports: [FormsModule, NgForOf, NgIf],
  templateUrl: './verify-email.component.html',
  styleUrl: './verify-email.component.css'
})
export class VerifyEmailComponent implements OnInit{

  @ViewChildren('codeInput')
  inputs!: QueryList<ElementRef>;

  digits = ['', '', '', '', '', ''];
  email = '';
  loading = false;
  error = '';
  success = false;

  resendCooldown = 30;
  canResend = false;
  private timer?: ReturnType<typeof setInterval>;

  constructor(
    public authService: AuthService,
    private emailVerificationService: EmailVerificationService,
    private route: ActivatedRoute,
    private router: Router
  ) {

    this.authService.currentUser$
      .subscribe(user => {
        this.email = user?.email ?? '';
      });
  }

  ngOnInit() {

    this.authService.currentUser$
      .subscribe(user => {this.email = user?.email ?? '';});

    this.route.queryParams.subscribe(params => {

      if (params['send'] === 'true') {

        this.emailVerificationService.requestVerificationCode()
          .subscribe({

            next: () => {
              this.error = '';
              this.startResendCooldown();
            },

            error: err => {
              this.error =
                err.error?.message ?? 'Verification failed';
            }

          });

      }

      else {
        this.startResendCooldown();
      }

    });

  }

  startResendCooldown() {
    this.canResend = false;
    this.resendCooldown = 30;
    if (this.timer) {
      clearInterval(this.timer);
    }
    this.timer = setInterval(() => {
      this.resendCooldown--;
      if (this.resendCooldown <= 0) {
        this.canResend = true;
        clearInterval(this.timer);
      }
    }, 1000);
  }

  get code(): string {
    return this.digits.join('');
  }

  moveNext(event: Event, index: number) {
    const input = event.target as HTMLInputElement;
    const value = input.value.replace(/\D/g, '').charAt(0) || '';

    this.digits = this.digits.map((d, i) => (i === index ? value : d));

    if (value && index < 5) {
      this.inputs.toArray()[index + 1]?.nativeElement.focus();
    }
  }

  backspace(event: Event, index: number) {

    const key = (event as KeyboardEvent).key;
    if (key !== 'Backspace') return;

    if (this.digits[index]) {
      this.digits = this.digits.map((d, i) => (i === index ? '' : d));
    } else if (index > 0) {
      this.digits = this.digits.map((d, i) => (i === index - 1 ? '' : d));
      this.inputs.toArray()[index - 1]?.nativeElement.focus();
    }

  }


  paste(event: ClipboardEvent) {

    event.preventDefault();
    const value = event.clipboardData?.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!value) return;

    this.digits = [...value.split(''), ...Array(6 - value.length).fill('')];
  }

  trackByIndex(index: number): number {
    return index;
  }

  verify() {

    if (this.code.length !== 6) {
      this.error = 'Please enter the 6 digit code';
      return;
    }

    this.loading = true;
    this.error = '';

    this.emailVerificationService
      .verifyEmail(this.code)
      .subscribe({
        next: () => {
          this.loading = false;
          this.success = true;
          setTimeout(() => {this.router.navigate(['/']);}, 1500);
        },

        error: err => {
          this.loading = false;
          this.error =
            err.error?.message ?? 'Verification failed';
        }
      });

  }




  resend() {
    if (!this.canResend) {
      return;
    }
    this.emailVerificationService
      .requestVerificationCode()
      .subscribe({
        next: () => {
          this.error = '';
          this.startResendCooldown();
        },
        error: err => {
          this.error = err.error?.message ?? 'Unable to resend';
        }
      });
  }
}
