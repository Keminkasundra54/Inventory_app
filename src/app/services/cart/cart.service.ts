import { HttpClient } from '@angular/common/http';
import { Injectable, effect } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  url: any
  // url = environment.url
  constructor(private http: HttpClient, private auth: AuthService) {
    effect(() => {
      this.url = this.auth.url()
    })

  }

  getCart(id: any) {
    let url = this.url + 'getUserCart '

    return this.http.post(url, id, { observe: 'response' })
  }
  addToCart(data: any) {
    let url = this.url + 'addCart'

    return this.http.post(url, data, { observe: 'response' })
  }
  updateCart(data: any) {
    let url = this.url + 'updateCartQuantity '

    return this.http.post(url, data, { observe: 'response' })
  }
  removeCart(data: any) {

    let url = this.url + 'removeProductFromCart '

    return this.http.post(url, data, { observe: 'response' })
  }
}
