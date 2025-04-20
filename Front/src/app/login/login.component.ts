import { MatCardModule } from '@angular/material/card'; // Import manquant
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../shared/auth.service';
import { NgIf } from '@angular/common';
import { MatError } from '@angular/material/form-field';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    NgIf,
    MatError,
    MatIconModule,
    MatCardModule // Ajout de MatCardModule
  ]
})
export class LoginComponent {
  username = '';
  password = '';
  loginFailed = false;
  loading = false;

  constructor(private authService: AuthService, private router: Router) {}

  onLogin() {
    this.loading = true;
    this.authService.login(this.username, this.password).subscribe(success => {
      this.loading = false;
      if (success) {
        const role = this.authService.getUserRole();
        this.router.navigate([role === 'admin' ? '/stats' : '/home']);
      } else {
        this.loginFailed = true;
      }
    });
  }
}
