import { NgModule } from '@angular/core';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatAutocompleteModule } from '@angular/material/autocomplete'; 
import { MatCommonModule } from '@angular/material/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { NavComponent } from './nav.component';
import { Router, RouterModule } from '@angular/router';
@NgModule({
  declarations: [NavComponent],
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSlideToggleModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    MatCommonModule,
    MatToolbarModule,
    MatIconModule,
    RouterModule
  ],
  exports: [
    NavComponent
  ]
})
export class NavModule { }
