import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SecureComponent } from './secure/secure.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './auth.guard';
import { NotFoundComponent } from './not-found/not-found.component';

const routes: Routes = [
  { path: '', redirectTo: 'secure', pathMatch: 'full' },
  { path: 'secure', canActivate: [ AuthGuard ], component: SecureComponent },
  { path: 'login', component: LoginComponent },
  { path: '404', component: NotFoundComponent },
  { path: '**', redirectTo: '404' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
