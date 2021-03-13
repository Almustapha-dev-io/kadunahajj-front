import { Directive, HostListener, NgZone, OnInit, Renderer2 } from '@angular/core';
import { BreakpointObserver, MediaMatcher } from '@angular/cdk/layout';

import { AppBreakPointsObserver } from '../../common/AppBreakpointObserver';

@Directive({
  selector: '[appHideSidebarOutsideClick]'
})
export class HideSidebarOutsideClickDirective extends AppBreakPointsObserver {

  constructor(
    _mediaMatcher: MediaMatcher,
    zone: NgZone,
    private renderer: Renderer2
  ) {
    super(new BreakpointObserver(_mediaMatcher, zone));
  }

  @HostListener('click touchstart') onOutSideClick() {
    this.setScreenOrientations();

    console.log(this.breakpoints, 1111)
    if (!(this.isBigScreenLandscape || this.isBigScreenPortrait)) {
      this.renderer.removeClass(document.body, 'sidebar-open');
    }
  }

}
