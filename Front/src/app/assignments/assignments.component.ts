import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { FormsModule } from '@angular/forms';
import { Assignment } from './assignment.model';
import { AssignmentDetailComponent } from './assignment-detail/assignment-detail.component';
import { AssignmentsService } from '../shared/assignments.service';
import { Router, RouterLink } from '@angular/router';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatSliderModule } from '@angular/material/slider';
import { RouterModule } from '@angular/router';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmDialogComponent } from '../shared/confirm-dialog/confirm-dialog.component';

// Interface pour la réponse paginée
interface PaginatedResponse {
  docs: Assignment[];
  totalDocs: number;
  limit: number;
  totalPages: number;
  page: number;
  pagingCounter: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
  prevPage: number | null;
  nextPage: number | null;
}

@Component({
  selector: 'app-assignments',
  templateUrl: './assignments.component.html',
  styleUrls: ['./assignments.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    MatListModule,
    MatDividerModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    FormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    RouterLink,
    MatChipsModule,
    MatIconModule,
    MatSliderModule,
    RouterModule,
    MatTooltipModule
  ]
})

export class AssignmentsComponent implements OnInit {
  titre = 'Liste des assignments';
  assignments = new MatTableDataSource<Assignment>([]);

  // Pour la pagination
  page = 1;
  limit = 40;
  totalDocs = 0;
  totalPages = 0;
  pagingCounter = 1;
  hasPrevPage = false;
  hasNextPage = false;
  prevPage: number | null = null;
  nextPage: number | null = null;
  // Pour la data table angular
  displayedColumns: string[] = ['nom', 'dateDeRendu', 'rendu', 'auteur', 'matiere', 'note', 'remarques', 'actions'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  // Attention, pour l'injection de service, mettre en private !!! Sinon
  // ça ne marche pas
  constructor(private assignementsService: AssignmentsService,
              private router: Router,
              private dialog: MatDialog,
              private snackBar: MatSnackBar) {}

  ngOnInit() {
    console.log("ngOnInit appelé lors de l'instanciation du composant");

    // On récupère les assignments depuis le service
    this.getAssignments();

    /*
    // on veut passer la propriété ajoutActive à true au bout de 3 secondes
    setTimeout(() => {
      this.ajoutActive = true;
    }, 3000);
    */
  }

  getAssignments() {
    this.assignementsService.getAssignmentsPagines(this.page, this.limit)
      .subscribe((data: PaginatedResponse) => {
        this.assignments.data = data.docs;
        this.page = data.page;
        this.limit = data.limit;
        this.totalDocs = data.totalDocs;
        this.totalPages = data.totalPages;
        this.pagingCounter = data.pagingCounter;
        this.hasPrevPage = data.hasPrevPage;
        this.hasNextPage = data.hasNextPage;
        this.prevPage = data.prevPage;
        this.nextPage = data.nextPage;

        console.log("Données reçues dans le subscribe");
      });
    console.log("APRES L'APPEL AU SERVICE");
  }

  pageSuivante() {
    if(this.hasNextPage && this.nextPage) {
      this.page = this.nextPage;
      this.getAssignments();
    }
  }

  pagePrecedente() {
    if(this.hasPrevPage && this.prevPage) {
      this.page = this.prevPage;
      this.getAssignments();
    }
  }

  dernierePage() {
    this.page = this.totalPages;
    this.getAssignments();
  }
  premierePage() {
    this.page = 1;
    this.getAssignments();
  }

  // Pour le composant material paginator
  onPageEvent(event: any) {
    console.log(event);
    this.page = event.pageIndex + 1;
    this.limit = event.pageSize;
    this.getAssignments();
  }

  getColor(a: any): string {
    if (a.rendu) return 'green';
    else
      return 'red';
  }

  afficheDetail(row: any) {
    console.log(row);
    // On récupère l'id de l'assignment situé dans la colonne _id de la ligne
    // sélectionnée
    let id = row._id;
    // et on utilise le routeur pour afficher le détail de l'assignment
    this.router.navigate(['/assignments', id]);
  }

  // Méthode de suppression avec confirmation
  onDeleteAssignment(assignment: Assignment) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: { 
        title: 'Confirmation de suppression',
        message: `Êtes-vous sûr de vouloir supprimer le devoir "${assignment.nom}" ?`
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.assignementsService.deleteAssignment(assignment).subscribe({
          next: () => {
            this.snackBar.open('Devoir supprimé avec succès', 'Fermer', {
              duration: 3000
            });
            this.getAssignments(); // Rafraîchir la liste
          },
          error: (error) => {
            this.snackBar.open('Erreur lors de la suppression', 'Fermer', {
              duration: 3000
            });
          }
        });
      }
    });
  }
}