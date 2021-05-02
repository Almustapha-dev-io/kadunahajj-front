import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';

import { GuardsService } from '../../services/guards.service';

@Injectable({
  providedIn: 'root'
})
export class ReviewerGuard implements CanActivate {
  constructor(
    private guardsService: GuardsService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    const isReviewer = sessionStorage.getItem('isReviewer') === 'true';
    if (isReviewer) return true;

    this.router.navigate(['/']);
    return false;
  }

}
