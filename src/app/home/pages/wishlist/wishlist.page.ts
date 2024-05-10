import { Component, OnInit, ViewChild, effect } from '@angular/core';
import { IonModal, Platform } from '@ionic/angular';
import { WishlistService } from 'src/app/services/wishlist/wishlist.service';
import { environment } from 'src/environments/environment';
import { OverlayEventDetail } from '@ionic/core/components';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.page.html',
  styleUrls: ['./wishlist.page.scss'],
})
export class WishlistPage implements OnInit {
  @ViewChild(IonModal) modal: IonModal;

  userId: any
  wishListData: any = []
  link: any
  mobile: boolean = false
  constructor(private wish: WishlistService, private plateform: Platform, private auth: AuthService) {
    if (localStorage.getItem('userData')) {

      this.userId = JSON.parse(localStorage.getItem('userData')!)._id
    }
    this.getWishlist()

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
  ionViewDidEnter() {
    this.getWishlist()
  }
  handleRefresh(event: any) {
    setTimeout(() => {
      this.getWishlist()

      event.target.complete();
    }, 2000);
  }
  onWillDismiss(event: Event) {
    const ev = event as CustomEvent<OverlayEventDetail<string>>;
    if (ev.detail.role === 'confirm') {
      console.log('ok');

    }
  }
  cancel() {
    this.modal.dismiss(null, 'cancel');
  }
  getWishlist() {
    let obj = {
      userId: this.userId
    }
    this.wish.getWishList(obj).subscribe({
      next: (res: any) => {
        if (res) {
          this.wishListData = res.body.data
          console.log(this.wishListData);

        }
      },
      error: (err) => {
        console.error(err);

      }
    })
  }


  removeWishList(id: any) {
    let obj = {
      productId: id,
      userId: this.userId

    }
    this.wish.removeWishList(obj).subscribe({
      next: (res: any) => {
        if (res) {
          this.getWishlist()

        }
      },
      error: (err) => {
        console.error(err);

      }
    })
  }
}
