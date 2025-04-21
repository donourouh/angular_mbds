import { MatCardModule } from '@angular/material/card';
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
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

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
    MatCardModule,
    MatSnackBarModule,
    MatProgressSpinnerModule
  ]
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  loginFailed: boolean = false;
  loading: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  onLogin() {
    if (!this.username || !this.password) {
      this.snackBar.open('Veuillez remplir tous les champs', 'Fermer', {
        duration: 3000
      });
      return;
    }

    this.loading = true;
    this.loginFailed = false;

    console.log('Tentative de connexion avec:', { username: this.username });

    this.authService.login(this.username, this.password).subscribe({
      next: (success) => {
        this.loading = false;
        if (success) {
          console.log('Connexion réussie');
          const role = this.authService.getUserRole();
          if (role === 'admin') {
            this.router.navigate(['/admin']);
          } else {
            this.router.navigate(['/home']);
          }
          this.snackBar.open('Connexion réussie !', 'Fermer', {
            duration: 3000
          });
        } else {
          console.log('Échec de la connexion');
          this.loginFailed = true;
          this.snackBar.open('Identifiants incorrects', 'Fermer', {
            duration: 3000
          });
        }
      },
      error: (error) => {
        console.error('Erreur lors de la connexion:', error);
        this.loading = false;
        this.loginFailed = true;
        let message = 'Erreur lors de la connexion';
        if (error.status === 0) {
          message = 'Impossible de contacter le serveur';
        } else if (error.error && error.error.message) {
          message = error.error.message;
        }
        this.snackBar.open(message, 'Fermer', {
          duration: 5000
        });
      }
    });
  }
}
