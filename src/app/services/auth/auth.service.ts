import { HttpClient } from '@angular/common/http';
import { Injectable, effect, signal } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  url = signal('')
  // url = signal(environment.url)
  token: any
  userData = signal('')
  menuSignal = signal(false)
  constructor(private http: HttpClient, private router: Router) {
    effect(() => {
      this.getToken()
    })

  }
  signup(data: any) {
    console.log(data);

    let url = this.url() + 'register'

    let info = this.http.post(url, data, { observe: 'response' })
    console.log(info);

    return info
  }
  login(data: any) {
    console.log(data);

    let url = this.url() + 'login'

    let info = this.http.post(url, data, { observe: 'response' })
    console.log(info);

    return info
  }
  forgotPassword(data: any) {
    let url = this.url() + 'frgtpassword'

    return this.http.post(url, data, { observe: 'response' })
  }
  resetPassword(data: any) {
    let url = this.url() + 'resetpass'

    return this.http.post(url, data, { observe: 'response' })
  }
  isLoggedIn() {
    if (localStorage.getItem('userData')) {

      this.userData.set(JSON.parse(localStorage.getItem('userData')!))
      console.log(this.userData());

      this.router.navigate(['']);

    }
  }
  emailConfirmation(key: any) {
    let url = this.url() + 'activate'
    return this.http.post(url, key, { observe: 'response' })
  }
  getToken() {
    if (localStorage.getItem('userData')) {
      console.log(JSON.parse(localStorage.getItem('userData')!).token);

      return JSON.parse(localStorage.getItem('userData')!).token
    } else {
      this.router.navigate(['']);
    }
  }
}
