import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {

  
  private activeRequests = 0;
  constructor(private loadingCtrl:LoadingController) { }

  showLoader(){
    this.activeRequests++;
  }

  hideLoader(){
    if (this.activeRequests > 0) {
      this.activeRequests--;
    }
  }

  isLoading(){
    return this.activeRequests > 0;
  }

  // async showLoading() {
  //   const loading = await this.loadingCtrl.create({
  //     // message: 'Dismissing after 3 seconds...',
  //     duration: 500,
  //     showBackdrop:true,
  //     spinner:'bubbles',
  //   });

  //   loading.present();
  // }
}
