import { Routes } from '@angular/router';

export const routes: Routes = [
    { path: '', redirectTo: 'angular/todo', pathMatch: 'full' }, // Default route
    { path: 'angular', loadChildren: () => import('./angular/angular.module').then(m => m.AngularModule) },
    { path: 'auth', loadChildren: () => import('./angular/auth-routing.module').then(m => m.AuthRoutingModule) },
    { path: '**', redirectTo: 'angular/todo' } // Wildcard route for any undefined route
];