import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatieresService } from '../shared/matiere.service';
import { Matiere } from '../shared/models/matiere.model';
import { MatiereDialogComponent } from './matiere-dialog/matiere-dialog.component';

@Component({
  selector: 'app-matieres',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './matieres.component.html',
  styleUrls: ['./matieres.component.css']
})
export class MatieresComponent implements OnInit {
  matieres: Matiere[] = [];
  displayedColumns: string[] = ['image', 'nom', 'prof', 'actions'];

  constructor(
    private matieresService: MatieresService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.loadMatieres();
  }

  loadMatieres() {
    this.matieresService.getMatieres().subscribe(matieres => {
      this.matieres = matieres;
    });
  }

  onDelete(matiere: Matiere) {
    if(confirm(`Êtes-vous sûr de vouloir supprimer la matière ${matiere.nom} ?`)) {
      this.matieresService.deleteMatiere(matiere._id!).subscribe({
        next: () => {
          this.loadMatieres();
          this.snackBar.open('Matière supprimée avec succès', 'Fermer', {
            duration: 3000
          });
        },
        error: (error) => {
          this.snackBar.open('Erreur lors de la suppression de la matière', 'Fermer', {
            duration: 3000
          });
        }
      });
    }
  }

  onEdit(matiere: Matiere) {
    const dialogRef = this.dialog.open(MatiereDialogComponent, {
      data: { matiere }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.matieresService.updateMatiere({ ...result, _id: matiere._id }).subscribe({
          next: () => {
            this.loadMatieres();
            this.snackBar.open('Matière modifiée avec succès', 'Fermer', {
              duration: 3000
            });
          },
          error: (error) => {
            this.snackBar.open('Erreur lors de la modification de la matière', 'Fermer', {
              duration: 3000
            });
          }
        });
      }
    });
  }

  addNewMatiere() {
    const dialogRef = this.dialog.open(MatiereDialogComponent, {
      data: { matiere: null }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.matieresService.addMatiere(result).subscribe({
          next: () => {
            this.loadMatieres();
            this.snackBar.open('Matière ajoutée avec succès', 'Fermer', {
              duration: 3000
            });
          },
          error: (error) => {
            this.snackBar.open('Erreur lors de l\'ajout de la matière', 'Fermer', {
              duration: 3000
            });
          }
        });
      }
    });
  }
}
