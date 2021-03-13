import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { PilgrimListComponent } from './pilgrim-list/pilgrim-list.component';
import { PilgrimFormComponent } from './pilgrim-form/pilgrim-form.component';
import { PilgrimAdminListComponent } from './pilgrim-admin-list/pilgrim-admin-list.component';
import { PilgrimReviewerListComponent } from './pilgrim-reviewer-list/pilgrim-reviewer-list.component';
import { PilgrimDeletedReviewerListComponent } from './pilgrim-deleted-reviewer-list/pilgrim-deleted-reviewer-list.component';
import { DashboardComponent } from './dashboard/dashboard.component';

import { InitiatorGuard } from '../../common/guards/initiator.guard';
import { AuthGuard } from '../../common/guards/auth.guard';
import { UserAdminGuard } from '../../common/guards/user-admin.guard';
import { ReviewerGuard } from '../../common/guards/reviewer.guard';

const routes: Routes = [
  { path: 'dashboard', canActivate: [AuthGuard], component: DashboardComponent },

  { path: 'pilgrims', canActivate: [AuthGuard, InitiatorGuard], component: PilgrimListComponent },
  { path: 'register-pilgrim', canActivate: [AuthGuard, InitiatorGuard], component: PilgrimFormComponent },

  { path: 'pilgrims-admin', canActivate: [AuthGuard, UserAdminGuard], component: PilgrimAdminListComponent },

  { path: 'pilgrims-reviewer', canActivate: [AuthGuard, ReviewerGuard], component: PilgrimReviewerListComponent },
  { path: 'pilgrims-deleted-reviewer', canActivate: [AuthGuard, ReviewerGuard], component: PilgrimDeletedReviewerListComponent },

  { path: '', redirectTo: 'pilgrims', pathMatch: 'full' }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class UserRoutingModule { }
