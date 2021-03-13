import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthComponent } from './auth/auth.component';
import { MainComponent } from './main/main.component';

const routes: Routes = [
  { path: 'login', component: AuthComponent },

  { path: 'app/admin',
    component: MainComponent,
    loadChildren: () => import('./main/admin/admin.module').then(module => module.AdminModule),
  },

  { path: '', redirectTo: 'login', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
