import { HttpClient } from '@angular/common/http';
import { Injectable, effect } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class WishlistService {

  url: any
  constructor(private http: HttpClient, private router: Router, private auth: AuthService) {
    effect(() => {
      this.url = this.auth.url()
    })
  }

  getWishList(id: any) {
    let url = this.url + 'getUserWishlist'
    console.log(url);

    return this.http.post(url, id, { observe: 'response' })
  }
  addWishList(id: any) {
    console.log(id);
    let url = this.url + 'addWishlist'

    return this.http.post(url, id, { observe: 'response' })
  }
  removeWishList(id: any) {
    console.log(id);

    let url = this.url + 'removeWishlist'

    return this.http.post(url, id, { observe: 'response' })
  }
}
