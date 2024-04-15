import { HttpClient } from '@angular/common/http';
import { Injectable, effect } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  url :any
  constructor(private http: HttpClient, private router: Router, private auth:AuthService) { 
    effect(() => {
      this.url = this.auth.url()
    })
  }

  // getCategories() {
  //   let url = this.url + 'getCategorys'

  //   return this.http.get(url, { observe: 'response' })
  // }
  getCategoryByStore(data: any) {
    console.log(this.url)
    let url = this.url + 'getCategoryByStore'

    return this.http.post(url, data, { observe: 'response' })
  }
}
