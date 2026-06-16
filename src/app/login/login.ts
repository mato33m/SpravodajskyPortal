import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html'
})
export class LoginComponent {

  auth = inject(AuthService);
  router = inject(Router);

  // shared
  mode = signal<'login' | 'register'>('login');
  error = signal<string>('');
  loading = signal<boolean>(false);

  // login fields
  username = '';
  password = '';

  // register fields
  regUsername = '';
  regPassword = '';
  regPasswordConfirm = '';
  regFirstName = '';
  regLastName = '';
  regEmail = '';

  switchMode(m: 'login' | 'register') {
    this.mode.set(m);
    this.error.set('');
  }

  submit() {
    this.error.set('');
    this.loading.set(true);

    this.auth.login(this.username, this.password).subscribe({
      next: () => {
        this.loading.set(false);
        this.router.navigate(['/articles']);
      },
      error: () => {
        this.loading.set(false);
        this.error.set('Nesprávne meno alebo heslo.');
      }
    });
  }

  register() {
    this.error.set('');

    if (this.regPassword !== this.regPasswordConfirm) {
      this.error.set('Heslá sa nezhodujú.');
      return;
    }

    this.loading.set(true);

    this.auth.register(
      this.regUsername,
      this.regPassword,
      this.regFirstName,
      this.regLastName,
      this.regEmail
    ).subscribe({
      next: () => {
        this.loading.set(false);
        this.router.navigate(['/articles']);
      },
      error: (err) => {
        this.loading.set(false);
        if (err.status === 409) {
          this.error.set('Používateľské meno je už obsadené.');
        } else if (err.status === 400) {
          this.error.set('Vyplňte všetky povinné polia.');
        } else {
          this.error.set('Registrácia zlyhala. Skúste znova.');
        }
      }
    });
  }
}
