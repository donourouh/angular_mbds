import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Matiere } from '../../shared/models/matiere.model';

@Component({
  selector: 'app-matiere-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  template: `
    <h2 mat-dialog-title>{{data.matiere ? 'Modifier' : 'Ajouter'}} une matière</h2>
    <mat-dialog-content>
      <form [formGroup]="matiereForm" class="matiere-form">
        <mat-form-field appearance="fill">
          <mat-label>Nom de la matière</mat-label>
          <input matInput formControlName="nom" required>
        </mat-form-field>

        <mat-form-field appearance="fill">
          <mat-label>URL de l'image de la matière</mat-label>
          <input matInput formControlName="imageMatiere" required>
        </mat-form-field>

        <div formGroupName="prof">
          <mat-form-field appearance="fill">
            <mat-label>Nom du professeur</mat-label>
            <input matInput formControlName="nom" required>
          </mat-form-field>

          <mat-form-field appearance="fill">
            <mat-label>URL de la photo du professeur</mat-label>
            <input matInput formControlName="photo" required>
          </mat-form-field>
        </div>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="onCancel()">Annuler</button>
      <button mat-raised-button color="primary" 
              (click)="onSubmit()" 
              [disabled]="!matiereForm.valid">
        {{data.matiere ? 'Modifier' : 'Ajouter'}}
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .matiere-form {
      display: flex;
      flex-direction: column;
      gap: 16px;
      min-width: 400px;
      padding: 16px 0;
    }
  `]
})
export class MatiereDialogComponent {
  matiereForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<MatiereDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { matiere: Matiere | null }
  ) {
    this.matiereForm = this.fb.group({
      nom: ['', Validators.required],
      imageMatiere: ['', Validators.required],
      prof: this.fb.group({
        nom: ['', Validators.required],
        photo: ['', Validators.required]
      })
    });

    if (data.matiere) {
      this.matiereForm.patchValue(data.matiere);
    }
  }

  onSubmit() {
    if (this.matiereForm.valid) {
      this.dialogRef.close(this.matiereForm.value);
    }
  }

  onCancel() {
    this.dialogRef.close();
  }
}
