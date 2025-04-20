import { Component, ViewChild } from '@angular/core';
import { MatSidenavModule, MatSidenav } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [
    CommonModule,
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatListModule,
    RouterModule
  ],
  templateUrl: './navigation.component.html',
  styleUrl: './navigation.component.css'
})
export class NavigationComponent {
  @ViewChild('sidenav') sidenav!: MatSidenav;

  constructor(private router: Router, public authService: AuthService) {}

  // Méthode pour vérifier si un lien est actif
  isActive(route: string): boolean {
    return this.router.url === route;
  }

  // Méthode pour fermer la sidenav sur mobile
  closeSidenav() {
    if (window.innerWidth < 768) {
      this.sidenav?.close();
    }
  }

  // Méthode pour générer les données de test
  genererDonneesDeTest() {
    console.log("Génération de données de test");
    // Ajoutez ici votre logique de génération de données
  }
}
