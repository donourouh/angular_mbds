import { Component, Input, OnInit } from '@angular/core';
import { Assignment } from '../assignment.model';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { AssignmentsService } from '../../shared/assignments.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-assignment-detail',
  standalone: true,
  imports: [
    MatCardModule, 
    CommonModule, 
    MatButtonModule,
    MatCheckboxModule,
    MatChipsModule,
    MatIconModule,
    MatDividerModule,
    MatSnackBarModule,
    MatDialogModule,
    RouterLink,
    FormsModule,
    MatFormFieldModule,
    MatInputModule
  ],
  templateUrl: './assignment-detail.component.html',
  styleUrls: ['./assignment-detail.component.css']
})
export class AssignmentDetailComponent implements OnInit {
  @Input() assignmentTransmis?: Assignment;
  isEditing = false;

  constructor(
    private assignmentsService: AssignmentsService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.getAssignment();
  }

  getAssignment(): void {
    const id = this.route.snapshot.params['id'];
    this.assignmentsService.getAssignment(id).subscribe({
      next: (assignment) => {
        this.assignmentTransmis = assignment;
      },
      error: (error) => {
        this.snackBar.open('Erreur lors du chargement du devoir', 'Fermer', {
          duration: 3000,
        });
      }
    });
  }

  assignmentRendu() {
    if (!this.assignmentTransmis) return;

    this.assignmentTransmis.rendu = true;
    this.assignmentsService.updateAssignment(this.assignmentTransmis).subscribe({
      next: () => {
        this.snackBar.open('Devoir marqué comme rendu !', 'OK', {
          duration: 2000,
        });
      },
      error: (error) => {
        this.snackBar.open('Erreur lors de la mise à jour', 'Fermer', {
          duration: 3000,
        });
      }
    });
  }

  onDeleteAssignment() {
    if (!this.assignmentTransmis) return;

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: { name: this.assignmentTransmis.nom }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.assignmentsService.deleteAssignment(this.assignmentTransmis!).subscribe({
          next: () => {
            this.snackBar.open('Devoir supprimé avec succès', 'OK', {
              duration: 2000,
            });
            this.router.navigate(['/assignments']);
          },
          error: (error) => {
            this.snackBar.open('Erreur lors de la suppression', 'Fermer', {
              duration: 3000,
            });
          }
        });
      }
    });
  }

  getNoteColor(): 'accent' | 'warn' {
    return this.assignmentTransmis && 
           this.assignmentTransmis.note !== undefined && 
           this.assignmentTransmis.note >= 10 ? 'accent' : 'warn';
  }

  getNoteIcon(): string {
    return this.assignmentTransmis && 
           this.assignmentTransmis.note !== undefined && 
           this.assignmentTransmis.note >= 10 ? 'grade' : 'warning';
  }
}
