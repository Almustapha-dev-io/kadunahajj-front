import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';


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
    EditLocalGovComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    NgxPaginationModule,
    NgbModule,
    FormsModule,
    MaterialModule,
    AppCommonModule
  ]
})
export class AdminModule { }
