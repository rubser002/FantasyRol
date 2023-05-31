import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatCommonModule } from '@angular/material/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { LayoutComponent } from './layout/layout.component';
import { NavModule } from './nav/nav.module';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { SignupComponent } from './signup/signup.component';
import { HttpClientModule } from '@angular/common/http';
import { MatGridListModule } from '@angular/material/grid-list';
import {MatTooltipModule} from '@angular/material/tooltip';
import { ToastrModule } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { ChractersDetailsComponent } from './chracter/chracters-details/chracters-details.component';
import { ChractersListComponent } from './chracter/chracters-list/chracters-list.component';
import { ChractersNewComponent } from './chracter/chracters-new/chracters-new.component';
import { ChractersEditComponent } from './chracter/chracters-edit/chracters-edit.component';
import {MatSelectModule} from '@angular/material/select';
import { MatStepperModule } from '@angular/material/stepper';
import { ToastModule } from '@coreui/angular';
import { ProgressModule } from '@coreui/angular';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    LayoutComponent,
    SignupComponent,
    ChractersDetailsComponent,
    ChractersListComponent,
    ChractersNewComponent,
    ChractersEditComponent,
    
  ],
  imports: [
    CommonModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSlideToggleModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    MatCommonModule,
    MatToolbarModule,
    MatIconModule,
    NavModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    HttpClientModule,
    MatGridListModule,
    MatTooltipModule,
    MatSelectModule,
    MatStepperModule,
    ToastModule,
    ProgressModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
  
 }
