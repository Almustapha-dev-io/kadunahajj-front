import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { GuardsService } from '../../services/guards.service';

@Injectable({
  providedIn: 'root'
})
export class UserGuard implements CanActivate {

  constructor(
    private guardsService: GuardsService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    const isUserAdmin = sessionStorage.getItem('isUserAdmin') === 'true';
    const isReviewer = sessionStorage.getItem('isReviewer') === 'true';
    const isInitiator = sessionStorage.getItem('isInitiator') === 'true';

    const bool = isInitiator || isUserAdmin || isReviewer;

    if (bool)  return true;

    this.router.navigate(['/']);
    return false;
  }

}
