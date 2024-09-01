import { Routes } from '@angular/router';

export const routes: Routes = [
    { path: '', redirectTo: 'angular/todo', pathMatch: 'full' },
    { path: 'angular', loadChildren: () => import('./angular/angular.module').then(m => m.AngularModule) },
    { path: 'auth', loadChildren: () => import('./angular/auth-routing.module').then(m => m.AuthRoutingModule) },
    { path: '**', redirectTo: 'angular/todo' } 
];