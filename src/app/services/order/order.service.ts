import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Injectable, Inject, PLATFORM_ID, effect } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AuthService } from '../auth/auth.service';
function _window(): any {

  // return the global native browser window object

  return window;

}
@Injectable({
  providedIn: 'root'
})
export class OrderService {
  url: any
  constructor(private http: HttpClient, @Inject(PLATFORM_ID) private platformId: object, private auth: AuthService) {
    effect(() => {
      this.url = this.auth.url()
    })
  }

  get nativeWindow(): any {

    if (isPlatformBrowser(this.platformId)) {

      return _window();

    }

  }
  createRpOrder(data: any) {
    let url = this.url + 'createOrderInRp'
    console.log(data);

    return this.http.post(url, data, { observe: 'response' })
  }

  addOrder(data: any) {
    let url = this.url + 'addOrder'
    console.log(data);

    return this.http.post(url, data, { observe: 'response' })
  }


  orderStatus(data: any) {
    let url = this.url + 'getUserOrderStatus'
    console.log(data);

    return this.http.post(url, data, { observe: 'response' })
  }

  getOrder(id: any) {

    let url = this.url + 'getOneOrder'

    return this.http.post(url, id, { observe: 'response' })
  }

  cancelOrder(id: any) {
    let url = this.url + 'cancelOrder'

    return this.http.post(url, id, { observe: 'response' })
  }
  // addAddress(data: any) {
  //   let url = this.url + 'addAddress'

  //   return this.http.post(url, data, { observe: 'response' })
  // }
}
