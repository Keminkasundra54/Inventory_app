import { HttpClient } from '@angular/common/http';
import { Injectable, effect } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { LoaderService } from '../loader/loader.service';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  url:any
  constructor(private http: HttpClient, private router: Router , private loader:LoaderService , private auth:AuthService) { 
    effect(()=>{
      this.url = this.auth.url()
    })
  }

  // getProducts() {
  //   let url = this.url + 'getProducts'
  //   // this.loader.showLoading()
  //   return this.http.get(url, { observe: 'response' })
  // }
  getProductByStore(data: any) {
    
    let url = this.url + 'getProductByStore'

    return this.http.post(url, data, { observe: 'response' })
  }
  getProduct(id:any){
    console.log(id);
    
    let url = this.url + 'getOneProduct '
    // this.loader.showLoading()

    return this.http.post(url, id, { observe: 'response' })
  }
  getProductByCategory(id:any){
    let url = this.url + 'getProductByCategory'
    // this.loader.showLoading()

    return this.http.post(url,id, { observe: 'response' })
    
  }
  getProductByFilter(data:any){
    
    let url = this.url + 'getProductByFilter'
    // this.loader.showLoading()

    return this.http.post(url,data, { observe: 'response' })
  }
}
