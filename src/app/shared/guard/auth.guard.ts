import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import { Observable } from 'rxjs';
import {AuthService} from '../../authentication/auth-service.service';
import {User} from '../../class/user';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {


  constructor(
    public authService: AuthService,
    public router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (!this.authService.isLoggedIn) {
      this.router.navigate(['authentication']);
    }
    return true;
  }

  isUserLoggedIn(): boolean {
    if (!this.authService.isLoggedIn) {
      return false;
    }
    return true;
  }

  disconnect(): void {
    this.authService.signOut().then(() => {
      this.router.navigate(['authentication']);
    })
  }

}
