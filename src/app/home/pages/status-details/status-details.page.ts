import { Component, OnInit, effect } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlertController, IonicSlides } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth/auth.service';
import { OrderService } from 'src/app/services/order/order.service';
import { ProductService } from 'src/app/services/product/product.service';
import { WishlistService } from 'src/app/services/wishlist/wishlist.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-status-details',
  templateUrl: './status-details.page.html',
  styleUrls: ['./status-details.page.scss'],
})
export class StatusDetailsPage implements OnInit {
  orderData: any = []
  productData: any = []

  wishListData: any = []
  selectedOrder: any
  userId: any
  link :any
  swiperModules = [IonicSlides];
  wishList: boolean = false
  constructor(private route: ActivatedRoute, private order: OrderService, private wishlist: WishlistService, private product: ProductService,
    private alertController:AlertController, private auth:AuthService) {
      effect(()=>{
        this.link =  this.auth.url()
      })
     }

  ngOnInit() {
    if (localStorage.getItem('userData')) {

      this.userId = JSON.parse(localStorage.getItem('userData')!)._id
      this.getWishlist()

    }
  }
  handleRefresh(event:any) {
    setTimeout(() => {
      // Any calls to load data go here
      if (this.selectedOrder) {
        this.getOrder(this.selectedOrder)
        this.getWishlist()
      }
      event.target.complete();
    }, 2000);
  }
  ionViewDidEnter() {


    this.selectedOrder = this.route.snapshot.paramMap.get('id')!;
    console.log(this.selectedOrder,);

    if (this.selectedOrder) {
      this.getOrder(this.selectedOrder)
    }
    if (localStorage.getItem('userData')) {

      this.userId = JSON.parse(localStorage.getItem('userData')!)._id
      this.getWishlist()
    }
  }

  getOrder(id: any) {
    let obj = {
      orderId: id
    }
    this.order.getOrder(obj).subscribe({
      next: (res: any) => {
        if (res) {
          this.orderData = res.body.data[0]

          this.getProduct(this.orderData.productId)

        }
      },
      error: (err) => {
        console.error(err);

      }
    })
  }
  getProduct(id: any) {
    let obj = {
      productId: id
    }
    this.product.getProduct(obj).subscribe({
      next: (res: any) => {
        if (res) {
          this.productData = res.body.data[0]


        }
      },
      error: (err) => {
        console.error(err);

      }
    })
  }
  getWishlist() {
    let obj = {
      userId: this.userId
    }
    this.wishlist.getWishList(obj).subscribe({
      next: (res: any) => {
        if (res) {
          console.log(res);

          this.wishListData = res.body.data
          console.log(this.wishListData);
          if (this.wishListData.length) {

            this.wishListData.forEach((value: any) => {
              console.log(value);
              if (value) {

                if (value._id == this.selectedOrder) {
                  this.wishList = true
                } else {
                  this.wishList = false
                }
              }
            });
          }
        }
      },
      error: (err) => {
        console.error(err);

      }
    })
  }
  addWishList(id: any) {
    if (this.userId) {
      let obj = {
        productId: id,
        userId: this.userId
      }
      this.wishlist.addWishList(obj).subscribe({
        next: (res: any) => {
          if (res) {
            this.getOrder(this.selectedOrder)
            this.getWishlist()
          }
        },
        error: (err) => {
          console.error(err);

        }
      })
    }
  }

  removeWishList(id: any) {
    let obj = {
      productId: id,
      userId: this.userId

    }
    this.wishlist.removeWishList(obj).subscribe({
      next: (res: any) => {
        if (res) {
          this.wishList = false
          this.getOrder(this.selectedOrder)
          this.getWishlist()
        }
      },
      error: (err) => {
        console.error(err);

      }
    })
  }

  async cancel(id: any) {
    try {
      const confirmAlert = await this.alertController.create({
        header: 'Delete Message',
        message: 'Are you sure you want to cancel this Order?',
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
            // handler: async () => {
            //   // item.close();
            // },
          },
          {
            text: 'Confirm',
            handler: async () => {
                this.cancelOrder(id)
            },
          },
        ],
      });

      await confirmAlert.present();
    } catch (error) {
      console.error(error);
     
    }
  }
  cancelOrder(id: any) {
    let obj = {
      orderId: id
    }

    this.order.cancelOrder(obj).subscribe({
      next: (res: any) => {
        if (res) {
          this.getOrder(this.selectedOrder)
          this.getWishlist()
        }
      },
      error: (err) => {
        console.error(err);

      }
    })
  }
}
