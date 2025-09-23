import { NgModule } from '@angular/core';
import { Routes } from '@angular/router';
import { Login } from './login/login';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' },
  { path: 'login', component: Login }
];
