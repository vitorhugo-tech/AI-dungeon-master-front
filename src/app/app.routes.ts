import { Routes } from '@angular/router';
import { Login } from './login/login';
import { RpgHub } from './rpg-hub/rpg-hub';
import { authGuard } from './auth-guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: Login },
  { path: 'session', component: RpgHub },
  { path: '**', redirectTo: 'login' },
];
