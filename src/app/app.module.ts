import { ErrorHandler, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { AppErrorHandler } from './common/errors/app-error-handler';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AppRoutingModule } from './app-routing.module';
import { MaterialModule } from './material/material.module';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { DataService } from './services/data.service';
import { LoaderService } from './services/loader.service';
import { ModalLoaderService } from './services/modal-loader.service';

import { LoaderComponent } from './elements/loader/loader.component';
import { AuthComponent } from './auth/auth.component';
import { MainComponent } from './main/main.component';
import { HeaderComponent } from './elements/header/header.component';
import { SidebarComponent } from './elements/sidebar/sidebar.component';
import { FooterComponent } from './elements/footer/footer.component';
import { SidebarClosedHoverDirective } from './common/directives/sidebar-closed-hover.directive';
import { HideSidebarOutsideClickDirective } from './common/directives/hide-sidebar-outside-click.directive';


@NgModule({
  declarations: [
    AppComponent,
    AuthComponent,
    LoaderComponent,
    MainComponent,
    HeaderComponent,
    SidebarComponent,
    FooterComponent,
    SidebarClosedHoverDirective,
    HideSidebarOutsideClickDirective,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    MaterialModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [
    DataService,
    LoaderService,
    ModalLoaderService,
    { provide: ErrorHandler, useClass: AppErrorHandler}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
