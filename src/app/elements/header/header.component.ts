import { Component, OnInit, Renderer2, NgZone, OnDestroy } from '@angular/core';
import { BreakpointObserver, MediaMatcher } from '@angular/cdk/layout';

import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

import { ChangePasswordComponent } from '../../main/change-password/change-password.component';
import { AppBreakPointsObserver } from '../../common/AppBreakpointObserver';
import { SideBarService } from '../../services/side-bar.service';
import { StepsService } from '../../services/steps.service';
import { FormsService } from '../../services/forms.service';
import { ProfileComponent } from '../../main/profile/profile.component';
import { GuardsService } from '../../services/guards.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent extends AppBreakPointsObserver implements OnInit {

  name = sessionStorage.getItem('name');
  email = sessionStorage.getItem('email');

  constructor(
    _mediaMatcher: MediaMatcher,
    zone: NgZone,
    public sidebarService: SideBarService,
    private renderer: Renderer2,
    private router: Router,
    private dialog: MatDialog,
    private stepsService: StepsService,
    private formsService: FormsService,
    private guardsService: GuardsService
  ) {
    super(new BreakpointObserver(_mediaMatcher, zone));
  }

  ngOnInit(): void {
    this.setScreenOrientations();
  }

  logout() {
    sessionStorage.clear();
    this.stepsService.reset();
    this.formsService.reset();
    this.guardsService.reset();
    this.router.navigateByUrl('/');
  }

  changePasswordDialog() {
    window.scroll(0, 0);
    this.dialog.open(ChangePasswordComponent, {
      width: '28rem',
      disableClose: true
    });
  }

  viewProfile() {
    window.scroll(0, 0);
    this.dialog.open(ProfileComponent, {
      width: '35rem',
      disableClose: true
    });
  }

  toggleSidebar() {
    this.sidebarService.toggleSidebarFolded();

    if (this.isBigScreenLandscape || this.isBigScreenPortrait) {
      if (this.sidebarService.sidebarFolded) {
        this.renderer.removeClass(document.body, 'sidebar-folded');
      } else {
        this.renderer.addClass(document.body, 'sidebar-folded');
      }
    } else {
      if (this.sidebarService.sidebarFolded) {
        this.renderer.removeClass(document.body, 'sidebar-open');
      } else {
        this.renderer.addClass(document.body, 'sidebar-open');
      }
    }

  }

}
