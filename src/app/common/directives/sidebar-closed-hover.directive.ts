import { Directive, HostListener, Renderer2 } from '@angular/core';
import { SideBarService } from '../../services/side-bar.service';

@Directive({
  selector: '[appSidebarClosedHover]'
})
export class SidebarClosedHoverDirective  {

  constructor(
    private renderer: Renderer2,
    private sidebarService: SideBarService
  ) {}

  @HostListener('mouseenter') onMouseEntered() {
    this.renderer.addClass(document.body, 'open-sidebar-folded')
  }

  @HostListener('mouseleave') onMouseExit() {
    this.renderer.removeClass(document.body, 'open-sidebar-folded')
  }
}
