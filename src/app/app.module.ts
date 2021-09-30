import { ErrorHandler, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { AppErrorHandler } from './common/errors/app-error-handler';

import { AppRoutingModule } from './app-routing.module';
import { MaterialModule } from './material/material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { DataService } from './services/data.service';
import { LoaderService } from './services/loader.service';
import { ModalLoaderService } from './services/modal-loader.service';

import { AuthComponent } from './auth/auth.component';
import { MainComponent } from './main/main.component';
import { HeaderComponent } from './elements/header/header.component';
import { SidebarComponent } from './elements/sidebar/sidebar.component';
import { FooterComponent } from './elements/footer/footer.component';
import { SidebarClosedHoverDirective } from './common/directives/sidebar-closed-hover.directive';
import { HideSidebarOutsideClickDirective } from './common/directives/hide-sidebar-outside-click.directive';
import { NgxPaginationModule } from 'ngx-pagination';
import { ChangePasswordComponent } from './main/change-password/change-password.component';
import { AppCommonModule } from './app-common/app-common.module';
import { ProfileComponent } from './main/profile/profile.component';


@NgModule({
  declarations: [
    AppComponent,
    AuthComponent,
    MainComponent,
    HeaderComponent,
    SidebarComponent,
    FooterComponent,
    SidebarClosedHoverDirective,
    HideSidebarOutsideClickDirective,
    ChangePasswordComponent,
    ProfileComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MaterialModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    BrowserAnimationsModule,
    AppCommonModule
  ],
  providers: [
    DataService,
    LoaderService,
    ModalLoaderService,
    // { provide: ErrorHandler, useClass: AppErrorHandler}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
