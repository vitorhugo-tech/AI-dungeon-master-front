// Angular core
import { Component } from '@angular/core';
import { Router } from '@angular/router';

// Angular forms
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormGroupDirective,
  FormsModule,
  NgForm,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

// Angular Material
import { ErrorStateMatcher } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTabsModule } from '@angular/material/tabs';

// App-specific imports
import { AuthService } from '@app/services/auth';
import { Dialog } from '@app/dialog/dialog';

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
  resetError: string = '';

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

  login() {
    this.loginError = '';
    if (!this.loginForm.valid) return;

    this.auth.login(this.loginForm.value).subscribe({
      next: (res: any) => {
        this.auth.saveTokens(res);
        this.router.navigate(['/session']);
      },
      error: (err: any) => {
        this.loginError = err.error.detail ?? 'Erro inesperado ao efetuar login.';
        console.error('Erro no login:', err);
      },
    });
  }

  create() {
    this.signupError = '';
    if (!this.signupForm.valid) return;

    if (this.signupForm.value.password !== this.signupForm.value.confirmPassword) {
      this.signupError = 'As duas senhas precisam ser iguais';
      return;
    }

    this.auth.create(this.signupForm.value).subscribe({
      next: (res: any) => {
        this.dialog.open(Dialog, {
          data: {
            title: 'Conta criada com sucesso',
            message: 'Verifique a mensagem enviada para seu e-mail para terminar a criação de sua conta.',
          },
        });
        this.goToTab(0);
      },
      error: (err: any) => {
        this.signupError = err.error.detail;
        console.error('Erro no login:', err);
      },
    });
  }

  recover() {
    if (!this.recoverForm.valid) return;

    this.auth.recover(this.recoverForm.value).subscribe({
      next: (res: any) => this.goToTab(3),
      error: (err: any) => {
        this.signupError = err.error.detail;
        console.error('Erro na requisição:', err);
      },
    });
  }

  confirmRecover() {
    if (!this.recoverForm.valid || !this.confirmationForm.valid) return;

    const data = { email: this.recoverForm.value.email, token_or_code: this.confirmationForm.value.code }

    this.auth.confirmRecover(data).subscribe({
      next: (res: any) => this.goToTab(4),
      error: (err: any) => {
        this.signupError = err.error.detail;
        console.error('Erro na requisição:', err);
      },
    });
  }

  reset() {
    if (!this.recoverForm.valid || !this.confirmationForm.valid || !this.passwordResetForm.valid) return;

    if (this.passwordResetForm.value.password !== this.passwordResetForm.value.confirmPassword) {
      this.resetError = 'As duas senhas precisam ser iguais';
      return;
    }

    const data = {
      email: this.recoverForm.value.email,
      token_or_code: this.confirmationForm.value.code,
      password: this.passwordResetForm.value.password
    }

    this.auth.reset(data).subscribe({
      next: (res: any) => {
        this.dialog.open(Dialog, {
          data: {
            title: 'Senha alterada com sucesso!',
            message: 'Você já pode utilizar sua nova senha para entrar na sua conta',
          },
        });
        this.goToTab(0)
      },
      error: (err: any) => {
        this.signupError = err.error.detail;
        console.error('Erro na requisição:', err);
      },
    });
  }
}
