import { Component, effect } from '@angular/core';
import { AuthService } from '../services/auth/auth.service';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  user: any 
  userId:any
  constructor(
    private auth: AuthService,
    private router:Router,
    private menuController:MenuController) {
    effect(() => {
      this.user = this.auth.userData()
      console.log(this.user);
      this.userId = this.user._id
    })
    auth.isLoggedIn()

    if (localStorage.getItem('userData')) {

      this.userId = JSON.parse(localStorage.getItem('userData')!)._id
    }
  }

  login() {
    this.router.navigate(['login'])
    this.menuController.close()

  }
  profile() {
    this.router.navigate(['profile'])
    this.menuController.close()
  }
  status() {
    this.router.navigate(['status'])
    this.menuController.close()
  }
  logOut() {
    localStorage.removeItem('userData')
    this.userId = null
    this.router.navigate([''])
    this.menuController.close()
  }
  openSecondMenu() {
 

    this.auth.menuSignal.set(true)
  }
}
