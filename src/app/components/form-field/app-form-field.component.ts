// app-form-field.component.ts
import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-form-field',
  standalone: true,
  templateUrl: './app-form-field.component.html',
  imports: [
    MatFormFieldModule,
    CommonModule
  ],
})
export class FormFieldComponent {
  @Input() title?: string;
  @Input() subtitle?: string;
  @Input() subtitleClass?: string;
  @Input() placeholder?: string;
  @Input() height?: string;
  @Input() info?: string;
  isInfoBoxVisible: boolean = false;
  emailFormControl = new FormControl();
}
