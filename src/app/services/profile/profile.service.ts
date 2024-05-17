import { HttpClient } from '@angular/common/http';
import { Injectable, effect } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  url: any
  constructor(private http: HttpClient, private auth: AuthService) {
    effect(() => {
      this.url = this.auth.url()
    })
  }

  getProfile(id: any) {
    let url = this.url + 'getUserProfile'
    console.log(id);

    return this.http.post(url, id, { observe: 'response' })
  }
  addAddress(data: any) {
    let url = this.url + 'addAddress'
    console.log(data);

    return this.http.post(url, data, { observe: 'response' })
  }
  removeAddress(data: any) {
    let url = this.url + 'removeAddress'
    console.log(data);

    return this.http.post(url, data, { observe: 'response' })
  }
  removeUserImage(data: any) {
    let url = this.url + 'removeUserImage'

    return this.http.post(url, data, { observe: 'response' })
  }
  updateProfile(data: any) {
    let url = this.url + 'updateProfile'

    return this.http.post(url, data, { observe: 'response' })
  }




}
