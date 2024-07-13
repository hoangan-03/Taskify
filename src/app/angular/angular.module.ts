import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AngularRoutingModule } from './angular-routing.module';
import { SideNavComponent } from './side-nav/side-nav.component'; 
import { FormFieldComponent } from '../components/form-field/app-form-field.component'; 
@NgModule({
  declarations: [
    
  ],
  imports: [
    CommonModule,
    AngularRoutingModule,
    SideNavComponent,
    FormFieldComponent
    
  ],
  exports: [
    FormFieldComponent,
    SideNavComponent // export SideNavComponent if it's used in other modules
  ]
})
export class AngularModule { }