import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { SignupComponent } from './signup/signup.component';
import { ChractersNewComponent } from './chracter/chracters-new/chracters-new.component';
import { ChractersListComponent } from './chracter/chracters-list/chracters-list.component';
import { ChractersDetailsComponent } from './chracter/chracters-details/chracters-details.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: 'home', component: HomeComponent },
      { path: 'character/new', component: ChractersNewComponent},
      { path: 'character/details/:characterId', component: ChractersDetailsComponent},

      { path: 'characters', component: ChractersListComponent},

    ]
  },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
