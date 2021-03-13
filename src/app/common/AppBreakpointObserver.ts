import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { IBreakpoints } from '../common/IBreakpoints';

export class AppBreakPointsObserver {

  breakpoints: IBreakpoints;

  constructor(
    private breakpointObserver: BreakpointObserver
  ) { }

  setScreenOrientations(): void {
    this.breakpointObserver.observe([
      Breakpoints.Handset,
      Breakpoints.Tablet,
      Breakpoints.Web,
    ]).subscribe(result => {

      const breakpoints = result.breakpoints;
      this.breakpoints = {
      isMobilePortrait: breakpoints['(max-width: 599.99px) and (orientation: portrait)'],
      isMobileLandscape: breakpoints['(max-width: 959.99px) and (orientation: landscape)'],
      isTabletPortrait: breakpoints['(min-width: 600px) and (max-width: 839.99px) and (orientation: portrait)'],
      isTabletLandscape: breakpoints['(min-width: 840px) and (orientation: portrait)'],
      isBigScreenPortrait: breakpoints['(min-width: 960px) and (max-width: 1279.99px) and (orientation: landscape)'],
      isBigScreenLandscape: breakpoints['(min-width: 1280px) and (orientation: landscape)']
      }
    });
  }

  get isMobilePortrait(): boolean {
    return this.breakpoints.isMobilePortrait;
  }

  get isMobileLandscape(): boolean {
    return this.breakpoints.isMobileLandscape;
  }

  get isTabletPortrait(): boolean {
    return this.breakpoints.isTabletPortrait;
  }

  get isTabletLandscape(): boolean {
    return this.breakpoints.isTabletLandscape;
  }

  get isBigScreenPortrait(): boolean {
    return this.breakpoints.isBigScreenPortrait;
  }

  get isBigScreenLandscape(): boolean {
    return this.breakpoints.isBigScreenLandscape;
  }

  get cardWidth(): string {

    if (this.isBigScreenLandscape || this.isBigScreenPortrait || this.isTabletLandscape)
      return '565px';

    if (this.isTabletPortrait || this.isMobileLandscape) return '400px';

    if (this.isMobilePortrait) return '90%';
  }
}
