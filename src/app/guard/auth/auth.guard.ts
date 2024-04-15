import { Injectable, effect } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  user: any
  constructor(private auth: AuthService,private router:Router) {
    // effect(() => {
    //   this.user = this.auth.userData()
    //   console.log(this.user);
    // })
  }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    if (localStorage.getItem('userData')) {

      return true;
    }else{
      this.router.navigate(['login'])
      return false
    }
  }

}
