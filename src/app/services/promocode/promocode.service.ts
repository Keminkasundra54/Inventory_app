import { HttpClient } from '@angular/common/http';
import { Injectable, effect } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class PromocodeService {

  url: any
  constructor(private http: HttpClient, private router: Router, private auth: AuthService) {
    effect(() => {
      this.url = this.auth.url()
    })
  }

  getPromoCodes() {
    let url = this.url + 'getPromoCodes'

    return this.http.get(url, { observe: 'response' })
  }
  getPromoCode(data: any) {
    let url = this.url + 'getUserWishlist'
    console.log(data);

    return this.http.post(url, data, { observe: 'response' })
  }
  searchPromoCode(data: any) {
    let url = this.url + 'searchPromoCode'
    console.log(data);

    return this.http.post(url, data, { observe: 'response' })
  }
  addPromoCode(id: any) {

    let url = this.url + 'addPromoCode'

    return this.http.post(url, id, { observe: 'response' })
  }
  edit(id: any) {

    let url = this.url + 'getOnePromoCode'
    console.log(id);

    return this.http.post(url, id, { observe: 'response' })
  }
  upate(id: any) {

    let url = this.url + 'updatePromoCode'

    return this.http.post(url, id, { observe: 'response' })
  }

  removePromoCode(id: any) {

    let url = this.url + 'removePromoCode'

    return this.http.post(url, id, { observe: 'response' })
  }
}
