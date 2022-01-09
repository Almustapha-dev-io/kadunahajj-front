import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { CommonModule } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ChartsModule } from '@rinminase/ng-charts';

import { UserRoutingModule } from './user-routing.module';
import { MaterialModule } from '../../material/material.module';
import { PilgrimListComponent } from './pilgrim-list/pilgrim-list.component';
import { AppCommonModule } from '../../app-common/app-common.module';
import { PilgrimDetailsComponent } from './pilgrim-list/pilgrim-details/pilgrim-details.component';
import { PilgrimFormComponent } from './pilgrim-form/pilgrim-form.component';
import { StepsComponent } from './pilgrim-form/steps/steps.component';
import { StepTemplateComponent } from './pilgrim-form/step-template/step-template.component';
import { EnrollmentDetailsComponent } from './pilgrim-form/enrollment-details/enrollment-details.component';
import { PersonalDetailsComponent } from './pilgrim-form/personal-details/personal-details.component';
import { NextOfKinDetailsComponent } from './pilgrim-form/next-of-kin-details/next-of-kin-details.component';
import { DocumentUploadComponent } from './pilgrim-form/document-upload/document-upload.component';
import { PaymentHistoryComponent } from './pilgrim-form/payment-history/payment-history.component';
import { ProgressComponent } from './pilgrim-form/document-upload/progress/progress.component';
import { PilgrimAdminListComponent } from './pilgrim-admin-list/pilgrim-admin-list.component';
import { PilgrimReviewerListComponent } from './pilgrim-reviewer-list/pilgrim-reviewer-list.component';
import { PilgrimDeletedReviewerListComponent } from './pilgrim-deleted-reviewer-list/pilgrim-deleted-reviewer-list.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { EditPilgrimComponent } from './pilgrim-list/edit-pilgrim/edit-pilgrim.component';
import { ExcelTableComponent } from './excel-table/excel-table.component';
import { RestorePilgrimComponent } from './pilgrim-admin-list/restore-pilgrim/restore-pilgrim.component';
import { InitiatorComponent } from './dashboard/initiator/initiator.component';
import { AdminComponent } from './dashboard/admin/admin.component';
import { ReviewerComponent } from './dashboard/reviewer/reviewer.component';
import { PilgrimDeleteComponent } from './pilgrim-delete/pilgrim-delete.component';
import { PilgrimMigrateComponent } from './pilgrim-migrate/pilgrim-migrate.component';
import { HajjAllocationListComponent } from './hajj-allocation-list/hajj-allocation-list.component';
import { AddHajjAllocationComponent } from './add-hajj-allocation/add-hajj-allocation.component';
import { ViewHajjAllocationComponent } from './view-hajj-allocation/view-hajj-allocation.component';
import { EditHajjAllocationComponent } from './edit-hajj-allocation/edit-hajj-allocation.component';
import { MigrateHajjAllocationComponent } from './migrate-hajj-allocation/migrate-hajj-allocation.component';
import { DeleteHajjAllocationComponent } from './delete-hajj-allocation/delete-hajj-allocation.component';
import { MigratedHajjAllocationListComponent } from './migrated-hajj-allocation-list/migrated-hajj-allocation-list.component';
import { PilgrimExportComponent } from './pilgrim-export/pilgrim-export.component';
import { AllocationExportComponent } from './allocation-export/allocation-export.component';
import { ReviewerAllocationExportComponent } from './reviewer-allocation-export/reviewer-allocation-export.component';

@NgModule({
  declarations: [
    PilgrimListComponent,
    PilgrimDetailsComponent,
    PilgrimFormComponent,
    StepsComponent,
    StepTemplateComponent,
    EnrollmentDetailsComponent,
    PersonalDetailsComponent,
    NextOfKinDetailsComponent,
    DocumentUploadComponent,
    PaymentHistoryComponent,
    ProgressComponent,
    PilgrimAdminListComponent,
    PilgrimReviewerListComponent,
    PilgrimDeletedReviewerListComponent,
    DashboardComponent,
    // EditPilgrimComponent,
    ExcelTableComponent,
    RestorePilgrimComponent,
    InitiatorComponent,
    AdminComponent,
    ReviewerComponent,
    EditPilgrimComponent,
    PilgrimDeleteComponent,
    PilgrimMigrateComponent,
    HajjAllocationListComponent,
    AddHajjAllocationComponent,
    ViewHajjAllocationComponent,
    EditHajjAllocationComponent,
    MigrateHajjAllocationComponent,
    DeleteHajjAllocationComponent,
    MigratedHajjAllocationListComponent,
    PilgrimExportComponent,
    AllocationExportComponent,
    ReviewerAllocationExportComponent
  ],
  imports: [
    CommonModule,
    UserRoutingModule,
    NgxPaginationModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    AppCommonModule,
    ChartsModule
  ]
})
export class UserModule { }
