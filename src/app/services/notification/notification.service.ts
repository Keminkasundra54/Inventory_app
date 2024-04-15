import { HttpClient } from '@angular/common/http';
import { Injectable, effect } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  url :any
  constructor(private http: HttpClient , private auth:AuthService) { 
    effect(() => {
      this.url = this.auth.url()
    })
  }

  getUserNotification(data: any) {
    let url = this.url + 'getUserNotification'

    return this.http.post(url, data, { observe: 'response' })
  }

  updateNoti(data:any){
    let url = this.url + 'updateNotification'

    return this.http.post(url, data, { observe: 'response' })
  }
  delete(data:any){
    let url = this.url + 'RemoveNotification'

    return this.http.post(url, data, { observe: 'response' })
  }
}
