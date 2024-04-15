import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable, delay, finalize } from 'rxjs';
import { AuthService } from '../services/auth/auth.service';
import { LoaderService } from '../services/loader/loader.service';
import { environment } from 'src/environments/environment';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  token:any
  constructor(private auth: AuthService, private loader: LoaderService) { 
    if(this.auth.getToken()){
    this. token = this.auth.getToken();

    }

  }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    console.log(this.token);

    if (!this.token) {
      request = request.clone({
        setHeaders: {
          storeId:environment.store1,
          "ngrok-skip-browser-warning": 'true',
        }
      });
    }else{
      console.log('yess token done ', request);

      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${this.token}`,
          token: `${this.token}`,
          'x-access-token': this.token,
          storeId:environment.store1,
          "ngrok-skip-browser-warning": 'true',
        }
      });
    }


    
    this.loader.showLoader();

    // return next.handle(request);

    return next.handle(request).pipe(
      delay(1000),
      finalize(() => {
        this.loader.hideLoader();

      })
    );
  }
}
