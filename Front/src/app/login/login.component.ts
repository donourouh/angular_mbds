import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../shared/auth.service';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgIf } from '@angular/common';
import { MatError } from '@angular/material/form-field';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  imports: [
    FormsModule,
    ReactiveFormsModule,
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
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  loading = false;
  hide = true;
  loginFailed = false;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.loginForm = this.formBuilder.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    if (this.authService.isLoggedIn()) {
      console.log('👤 Utilisateur déjà connecté, redirection...');
      this.redirectBasedOnRole();
    }
  }

  onLogin(): void {
    if (this.loginForm.invalid) {
      console.log('❌ Formulaire invalide');
      this.snackBar.open('Veuillez remplir tous les champs', 'Fermer', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'top',
      });
      return;
    }

    this.loading = true;
    this.loginFailed = false;
    console.log('🔄 Tentative de connexion...');

    const { username, password } = this.loginForm.value;
    
    this.authService.login(username, password).subscribe({
      next: (success) => {
        if (success) {
          console.log('✅ Connexion réussie');
          this.redirectBasedOnRole();
        } else {
          console.log('❌ Échec de la connexion');
          this.loginFailed = true;
          this.showError('Identifiants incorrects');
        }
      },
      error: (error) => {
        console.error('❌ Erreur lors de la connexion:', error);
        this.loginFailed = true;
        this.showError('Une erreur est survenue lors de la connexion');
      },
      complete: () => {
        this.loading = false;
        console.log('🏁 Fin de la tentative de connexion');
      }
    });
  }

  private redirectBasedOnRole(): void {
    const role = this.authService.getRoleConnecte();
    console.log('👥 Rôle de l\'utilisateur:', role);
    
    if (role === 'admin') {
      this.router.navigate(['/admin']);
    } else {
      this.router.navigate(['/assignments']);
    }
  }

  private showError(message: string): void {
    this.loading = false;
    this.snackBar.open(message, 'Fermer', {
      duration: 5000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: ['error-snackbar']
    });
  }
}
