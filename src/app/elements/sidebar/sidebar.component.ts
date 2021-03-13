import { Component, OnInit, Renderer2, NgZone, OnDestroy } from '@angular/core';
import { BreakpointObserver, MediaMatcher } from '@angular/cdk/layout';

import { AppBreakPointsObserver } from '../../common/AppBreakpointObserver';
import { SideBarService } from '../../services/side-bar.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent extends AppBreakPointsObserver implements OnInit {

  constructor(
    _mediaMatcher: MediaMatcher,
    zone: NgZone,
    public sidebarService: SideBarService,
    private renderer: Renderer2
  ) {
    super(new BreakpointObserver(_mediaMatcher, zone));
  }

  ngOnInit(): void {
    this.setScreenOrientations();
  }

  toggle() {
    this.sidebarService.toggleSidebarFolded();
    this.sidebarService.toggleActive();

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
