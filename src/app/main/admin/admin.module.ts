import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


import { AdminRoutingModule } from './admin-routing.module';
import { MaterialModule } from '../../material/material.module';

import { UsersComponent } from './users/users.component';
import { AddUserComponent } from './users/add-user/add-user.component';
import { EnrollmentZonesComponent } from './enrollment-zones/enrollment-zones.component';
import { HajjYearComponent } from './hajj-year/hajj-year.component';
import { EditEnrollmentZoneComponent } from './enrollment-zones/edit-enrollment-zone/edit-enrollment-zone.component';
import { BanksComponent } from './banks/banks.component';
import { StatesComponent } from './states/states.component';
import { LocalGovsComponent } from './local-govs/local-govs.component';
import { EditBankComponent } from './banks/edit-bank/edit-bank.component';
import { EditStateComponent } from './states/edit-state/edit-state.component';
import { EditLocalGovComponent } from './local-govs/edit-local-gov/edit-local-gov.component';
import { AppCommonModule } from '../../app-common/app-common.module';
import { NewHajjYearComponent } from './hajj-year/new-hajj-year/new-hajj-year.component';
import { ViewHajjYearComponent } from './hajj-year/view-hajj-year/view-hajj-year.component';
import { AddSeatAllocationsComponent } from './hajj-year/add-seat-allocations/add-seat-allocations.component';
import { EditSeatComponent } from './hajj-year/edit-seat/edit-seat.component';
import { NewZoneComponent } from './enrollment-zones/new-zone/new-zone.component';
import { ViewUpdateHistoryComponent } from './hajj-year/view-update-history/view-update-history.component';

@NgModule({
  declarations: [
    UsersComponent,
    AddUserComponent,
    EnrollmentZonesComponent,
    HajjYearComponent,
    EditEnrollmentZoneComponent,
    BanksComponent,
    StatesComponent,
    LocalGovsComponent,
    EditBankComponent,
    EditStateComponent,
    EditLocalGovComponent,
    NewHajjYearComponent,
    ViewHajjYearComponent,
    AddSeatAllocationsComponent,
    EditSeatComponent,
    NewZoneComponent,
    ViewUpdateHistoryComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    NgxPaginationModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    AppCommonModule
  ]
})
export class AdminModule { }
