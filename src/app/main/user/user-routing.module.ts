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
import { HajjAllocationListComponent } from './hajj-allocation-list/hajj-allocation-list.component';
import { MigratedHajjAllocationListComponent } from './migrated-hajj-allocation-list/migrated-hajj-allocation-list.component';
import { AllocationExportComponent } from './allocation-export/allocation-export.component';
import { PilgrimExportComponent } from './pilgrim-export/pilgrim-export.component';
import { ReviewerAllocationExportComponent } from './reviewer-allocation-export/reviewer-allocation-export.component';

const routes: Routes = [
    { path: 'dashboard', canActivate: [AuthGuard], component: DashboardComponent },

    { path: 'pilgrims', canActivate: [AuthGuard], component: PilgrimListComponent },
    { path: 'register-pilgrim', canActivate: [AuthGuard, InitiatorGuard], component: PilgrimFormComponent },

    //   { path: 'pilgrims-admin', canActivate: [AuthGuard, UserAdminGuard], component: PilgrimAdminListComponent },
    { path: 'hajj-allocations', canActivate: [AuthGuard], component: HajjAllocationListComponent },
    { path: 'hajj-allocations-reviewer', canActivate: [AuthGuard, ReviewerGuard], component: PilgrimReviewerListComponent },
    { path: 'deleted-hajj-allocations', canActivate: [AuthGuard, ReviewerGuard], component: PilgrimDeletedReviewerListComponent },
    { path: 'migrated-hajj-allocations', canActivate: [AuthGuard, ReviewerGuard], component: MigratedHajjAllocationListComponent },
    
    { path: 'hajj-allocations-exports-reviewer', canActivate: [AuthGuard, ReviewerGuard], component: ReviewerAllocationExportComponent },
    { path: 'hajj-allocations-exports', canActivate: [AuthGuard], component: AllocationExportComponent },
    { path: 'pilgrims-exports', canActivate: [AuthGuard], component: PilgrimExportComponent },

    
    { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
];

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(routes)
    ]
})
export class UserRoutingModule { }
