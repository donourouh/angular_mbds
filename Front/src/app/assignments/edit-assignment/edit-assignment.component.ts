import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router } from '@angular/router';
import { AssignmentsService } from '../../shared/assignments.service';
import { MatieresService } from '../../shared/matiere.service';
import { Assignment } from '../assignment.model';
import { Matiere } from '../../shared/models/matiere.model';

@Component({
  selector: 'app-edit-assignment',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    MatCheckboxModule,
    MatSnackBarModule,
    MatIconModule
  ],
  templateUrl: './edit-assignment.component.html',
  styleUrls: ['./edit-assignment.component.css']
})
export class EditAssignmentComponent implements OnInit {
  assignmentForm!: FormGroup;
  assignment?: Assignment;
  matieres: Matiere[] = [];

  constructor(
    private assignmentsService: AssignmentsService,
    private matieresService: MatieresService,
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar
  ) {
    this.initForm();
  }

  private initForm() {
    this.assignmentForm = this.formBuilder.group({
      nom: ['', [Validators.required, Validators.minLength(3)]],
      dateDeRendu: ['', Validators.required],
      matiere: ['', Validators.required],
      auteur: ['', [Validators.required, Validators.minLength(3)]],
      rendu: [false],
      note: [{ value: '', disabled: true }],
      remarques: ['']
    });

    // Active/désactive le champ note en fonction de l'état rendu
    this.assignmentForm.get('rendu')?.valueChanges.subscribe(rendu => {
      const noteControl = this.assignmentForm.get('note');
      if (rendu) {
        noteControl?.enable();
        noteControl?.setValidators([Validators.required, Validators.min(0), Validators.max(20)]);
      } else {
        noteControl?.disable();
        noteControl?.clearValidators();
      }
      noteControl?.updateValueAndValidity();
    });
  }

  ngOnInit(): void {
    // Charger les matières
    this.matieresService.getMatieres().subscribe(matieres => {
      this.matieres = matieres;
    });

    // Charger l'assignment à éditer
    const id = this.route.snapshot.params['id'];
    this.assignmentsService.getAssignment(id).subscribe({
      next: (assignmentRecu) => {
        if (assignmentRecu) {
          this.assignment = assignmentRecu;
          this.assignmentForm.patchValue({
            nom: this.assignment.nom,
            dateDeRendu: this.assignment.dateDeRendu,
            matiere: this.assignment.matiere,
            auteur: this.assignment.auteur,
            rendu: this.assignment.rendu,
            note: this.assignment.note,
            remarques: this.assignment.remarques
          });

          if (this.assignment.rendu) {
            this.assignmentForm.get('note')?.enable();
          }
        } else {
          this.snackBar.open('Assignment non trouvé', 'Fermer', {
            duration: 3000
          });
          this.router.navigate(['/assignments']);
        }
      },
      error: (error) => {
        this.snackBar.open('Erreur lors du chargement du devoir', 'Fermer', {
          duration: 3000
        });
        this.router.navigate(['/assignments']);
      }
    });
  }

  onSubmit() {
    if (this.assignmentForm.valid && this.assignment) {
      const updatedAssignment = {
        ...this.assignment,
        ...this.assignmentForm.value,
        dateDeRendu: new Date(this.assignmentForm.value.dateDeRendu)
      };

      this.assignmentsService.updateAssignment(updatedAssignment).subscribe({
        next: () => {
          this.snackBar.open('Devoir mis à jour avec succès', 'OK', {
            duration: 2000
          });
          this.router.navigate(['/home']);
        },
        error: (error) => {
          this.snackBar.open('Erreur lors de la mise à jour', 'Fermer', {
            duration: 3000
          });
        }
      });
    }
  }

  onCancel() {
    this.router.navigate(['/home']);
  }
}
 
 