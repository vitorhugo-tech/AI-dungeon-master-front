import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogClose,
  MatDialogContent,
  MatDialogTitle,
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
} from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';

export class MyErrorStateMatcher implements ErrorStateMatcher {
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
  matcher = new MyErrorStateMatcher();

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { title: string; message: string },
    private fb: FormBuilder
  ) {
    this.characterForm = this.fb.group({
      nome: ['', Validators.required],
      classe: ['', Validators.required],
      raca: ['', Validators.required],
      origens: ['', Validators.required]
    });
  }

  create() {
    this.characterError = '';
    if (this.characterForm.valid) {
      console.log(this.characterForm.value);
      /* this.auth.login(this.characterForm.value).subscribe({
        next: (res: any) => {
          this.auth.saveTokens(res);
          this.router.navigate(['/session']);
        },
        error: (err: any) => {
          this.characterError = err.error.detail;
          console.error('Erro na criação do personagem:', err);
        },
      }); */
    }
  }
}
