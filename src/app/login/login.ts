import { Component } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTabsModule } from '@angular/material/tabs';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
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
import { Router } from '@angular/router';
import { AuthService } from '../services/auth';
import { Dialog } from '../dialog/dialog';

export class FormErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatTabsModule,
  ],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  loginForm: FormGroup;
  loginError: string = '';

  signupForm: FormGroup;
  signupError: string = '';

  recoverForm: FormGroup;
  confirmationForm: FormGroup;
  passwordResetForm: FormGroup;
  matcher = new FormErrorStateMatcher();
  selectedTabIndex = 0;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private dialog: MatDialog
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });

    this.signupForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(5)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(5)]],
    });

    this.recoverForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });

    this.confirmationForm = this.fb.group({
      code: ['', [Validators.required]],
    });

    this.passwordResetForm = this.fb.group({
      password: ['', [Validators.required]],
      confirmPassword: ['', [Validators.required]],
    });
  }

  goToTab(num: number) {
    this.selectedTabIndex = num;
  }

  onSubmit(obj: object) {
    console.log(obj);
  }

  login() {
    this.loginError = '';
    if (this.loginForm.valid) {
      this.auth.login(this.loginForm.value).subscribe({
        next: (res: any) => {
          this.auth.saveTokens(res);
          this.router.navigate(['/session']);
        },
        error: (err: any) => {
          this.loginError = err.error.detail;
          console.error('Erro no login:', err);
        },
      });
    }
  }

  create() {
    this.signupError = '';
    if (this.signupForm.valid) {
      if (this.signupForm.value.password !== this.signupForm.value.confirmPassword) {
        this.signupError = 'As duas senhas precisam ser iguais';
        return;
      }
      this.auth.create(this.signupForm.value).subscribe({
        next: (res: any) => {
          this.dialog.open(Dialog, {
            data: {
              title: 'Conta criada com sucesso',
              message:
                'Verifique a mensagem enviada para seu e-mail para terminar a criação de sua conta.',
            },
          });
          this.goToTab(0);
          console.log(res);
        },
        error: (err: any) => {
          this.signupError = err.error.detail;
          console.error('Erro no login:', err);
        },
      });
    }
  }
}
