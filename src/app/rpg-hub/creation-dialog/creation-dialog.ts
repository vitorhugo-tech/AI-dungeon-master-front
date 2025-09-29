import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogClose,
  MatDialogContent,
  MatDialogTitle,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
  FormGroupDirective,
  NgForm,
  ReactiveFormsModule,
  FormsModule,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';

export class FormErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-creation-dialog',
  imports: [
    MatButtonModule,
    MatDialogClose,
    MatDialogContent,
    MatDialogTitle,
    FormsModule,
    MatFormFieldModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatInputModule,
    FontAwesomeModule,
  ],
  templateUrl: './creation-dialog.html',
  styleUrl: './creation-dialog.scss',
})
export class CreationDialog {
  faXmark = faXmark;

  classes: string[] = ['Guerreiro', 'Mago', 'Ladino', 'Clérigo'];
  racas: string[] = ['Humano', 'Elfo', 'Anão', 'Orc'];
  origens: string[] = [
    'Soldado',
    'Sobrevivente',
    'Trapaceiro',
    'Nobre',
    'Andarilho',
    'Sacerdote',
    'Estudioso',
    'Mercador',
  ];

  characterForm: FormGroup;
  characterError: string = '';
  matcher = new FormErrorStateMatcher();

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      personagem_id: string;
      nome: string;
      classe: string;
      raca: string;
      origens: string[];
    },
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<CreationDialog>
  ) {
    this.characterForm = this.fb.group({
      personagem_id: [data?.personagem_id || ''],
      nome: [data?.nome || '', Validators.required],
      classe: [data?.classe || '', Validators.required],
      raca: [data?.raca || '', Validators.required],
      origens: [data?.origens || [], [Validators.required, this.minSelected(2)]],
    });
  }

  minSelected(min: number) {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value || [];
      return value.length >= min ? null : { minSelected: true };
    };
  }

  sendData() {
    this.characterError = '';
    if (!this.characterForm.valid) {
      this.characterError = 'Corrija os erros restantes para poder salvar seu personagem';
      return;
    }
    const payload = this.characterForm.value;
    this.dialogRef.close(payload);
  }
}
