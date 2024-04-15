import { Injectable, effect } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class IpGuard implements CanActivate {
  url:any
  constructor(private auth:AuthService, private router:Router){
    effect(()=>{
      this.url = this.auth.url()
      console.log(this.url);
      
    })
  }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      if(this.url){
        // this.router.navigate(['products'])
        return true
      }else{
        this.router.navigate(['ipConfig'])

        return false;
        // return this.router.createUrlTree(['ipConfig'])
      }
  }
  
}
