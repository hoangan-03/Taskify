import { Routes } from '@angular/router';

export const routes: Routes = [
    {path:'angular',loadChildren:()=> import('./angular/angular.module').then(m=> m.AngularModule)}
];
