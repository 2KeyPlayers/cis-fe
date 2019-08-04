import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { DataService } from '../service/data.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private dataService: DataService) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (this.dataService.uzivatelPrihlaseny) {
      return true;
    }

    this.router.navigate(['/prihlasenie'], { queryParams: { returnUrl: state.url } });
    return false;
  }
}
