import { Component } from '@angular/core';
import { RouteConfigLoadStart, RouterEvent, Router, RouteConfigLoadEnd } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'pilgrim-system';
  appLoader = false;

  constructor(
    private router: Router
  ) {
    router.events.subscribe((event: RouterEvent) => {
      if (event instanceof RouteConfigLoadStart) {
        this.appLoader = true;
      } else if (event instanceof RouteConfigLoadEnd) {
        this.appLoader = false;
      }
    });
  }
}
