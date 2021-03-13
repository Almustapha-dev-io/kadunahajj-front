import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { UsersComponent } from './users/users.component';
import { EnrollmentZonesComponent } from './enrollment-zones/enrollment-zones.component';
import { HajjYearComponent } from './hajj-year/hajj-year.component';
import { BanksComponent } from './banks/banks.component';
import { StatesComponent } from './states/states.component';
import { LocalGovsComponent } from './local-govs/local-govs.component';
import { AuthGuard } from '../../common/guards/auth.guard';

const routes: Routes = [
  { path: 'users', canActivate: [AuthGuard], component: UsersComponent },
  { path: 'enrollment-zones', canActivate: [AuthGuard], component: EnrollmentZonesComponent },
  { path: 'hajj-year', canActivate: [AuthGuard], component: HajjYearComponent },
  { path: 'banks', canActivate: [AuthGuard], component: BanksComponent },
  { path: 'states', canActivate: [AuthGuard], component: StatesComponent },
  { path: 'lga', canActivate: [AuthGuard], component: LocalGovsComponent },

  { path: '', redirectTo: 'users', pathMatch: 'full' }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class AdminRoutingModule { }
