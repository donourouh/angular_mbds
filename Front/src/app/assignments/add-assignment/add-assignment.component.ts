import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatStepperModule } from '@angular/material/stepper';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AssignmentsService } from '../../shared/assignments.service';
import { MatieresService } from '../../shared/matiere.service';
import { Matiere } from '../../shared/models/matiere.model';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

interface AssignmentResponse {
  _id: string;
  message: string;
}

@Component({
  selector: 'app-add-assignment',
  standalone: true,
  imports: [
    CommonModule,
    MatStepperModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    MatIconModule,
    ReactiveFormsModule,
    MatSnackBarModule
  ],
  templateUrl: './add-assignment.component.html',
  styleUrls: ['./add-assignment.component.css']
})
export class AddAssignmentComponent implements OnInit {
  basicInfoForm!: FormGroup;
  matiereForm!: FormGroup;
  stateForm!: FormGroup;
  matieres: Matiere[] = [];
  isLinear = true;

  constructor(
    private _formBuilder: FormBuilder,
    private assignmentsService: AssignmentsService,
    private matieresService: MatieresService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.initializeForms();
  }

  ngOnInit(): void {
    this.matieresService.getMatieres().subscribe({
      next: (matieres: Matiere[]) => {
        this.matieres = matieres;
      },
      error: (error: Error) => {
        console.error('Erreur lors du chargement des matières:', error);
        this.snackBar.open('Erreur lors du chargement des matières', 'Fermer', {
          duration: 3000
        });
      }
    });
  }

  private initializeForms(): void {
    this.basicInfoForm = this._formBuilder.group({
      nom: ['', [Validators.required, Validators.minLength(3)]],
      auteur: ['', [Validators.required, Validators.minLength(3)]],
      dateDeRendu: ['', Validators.required]
    });

    this.matiereForm = this._formBuilder.group({
      matiere: ['', Validators.required]
    });

    this.stateForm = this._formBuilder.group({
      rendu: [false],
      note: [{ value: '', disabled: true }],
      remarques: ['']
    });

    this.stateForm.get('rendu')?.valueChanges.subscribe((rendu: boolean) => {
      const noteControl = this.stateForm.get('note');
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

  get selectedMatiere(): Matiere | null {
    return this.matiereForm.get('matiere')?.value || null;
  }

  isFormValid(): boolean {
    return Boolean(
      this.basicInfoForm?.valid &&
      this.matiereForm?.valid &&
      this.stateForm?.valid &&
      (!this.stateForm.get('rendu')?.value || this.stateForm.get('note')?.valid)
    );
  }

  onSubmit(): void {
    if (this.isFormValid() && this.selectedMatiere) {
      const assignment = {
        ...this.basicInfoForm.value,
        ...this.matiereForm.value,
        ...this.stateForm.value,
        matiere: this.selectedMatiere.nom,
        imageMatiere: this.selectedMatiere.imageMatiere,
        prof: this.selectedMatiere.prof.nom
      };

      this.assignmentsService.addAssignment(assignment).subscribe({
        next: (response) => {
          this.snackBar.open('Devoir ajouté avec succès', 'OK', {
            duration: 2000
          });
          this.router.navigate(['/home']);
        },
        error: (error) => {
          console.error('Erreur lors de l\'ajout du devoir:', error);
          this.snackBar.open('Erreur lors de l\'ajout du devoir', 'Fermer', {
            duration: 3000
          });
        }
      });
    } else {
      this.snackBar.open('Veuillez remplir tous les champs requis', 'Fermer', {
        duration: 3000
      });
    }
  }
}
