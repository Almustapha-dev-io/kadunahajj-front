import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthComponent } from './auth/auth.component';
import { MainComponent } from './main/main.component';

const routes: Routes = [
  { path: 'login', component: AuthComponent },

  {
    path: 'app/admin',
    component: MainComponent,
    loadChildren: () => import('./main/admin/admin.module').then(module => module.AdminModule)
  },

  {
    path: 'app/user',
    component: MainComponent,
    loadChildren: () => import('./main/user/user.module').then(module => module.UserModule)
  },

  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
