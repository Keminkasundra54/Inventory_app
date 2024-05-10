import { Component, OnInit, effect } from '@angular/core';
import { Platform } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth/auth.service';
import { OrderService } from 'src/app/services/order/order.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-status',
  templateUrl: './status.page.html',
  styleUrls: ['./status.page.scss'],
})
export class StatusPage implements OnInit {
  userId: any
  orderData: any = []
  link: any
  mobile: boolean = false
  constructor(private order: OrderService, private plateform: Platform, private auth: AuthService) {
    effect(() => {
      this.link = this.auth.url()
    })
  }

  ngOnInit() {
    if (this.plateform.is('android') || this.plateform.is('ios') || this.plateform.is('tablet') || this.plateform.is('ipad')) {
      this.mobile = true
      console.log(this.mobile);

    }
  }
  handleRefresh(event: any) {
    setTimeout(() => {
      this.getStatus()
      event.target.complete();
    }, 2000);
  }
  ionViewDidEnter() {
    if (localStorage.getItem('userData')) {

      this.userId = JSON.parse(localStorage.getItem('userData')!)._id

      this.getStatus()
    }
    // this.menuController.close()

  }

  getStatus() {
    let obj = {
      userId: this.userId
    }

    this.order.orderStatus(obj).subscribe({
      next: (res: any) => {
        if (res) {
          console.log(res);
          this.orderData = res.body.data
        }
      },
      error: (err) => {
        console.error(err);

      }
    })

  }
}







