import { Component, Inject, OnInit, ViewChild, effect, inject } from '@angular/core';
import { CartService } from 'src/app/services/cart/cart.service';
import { environment } from 'src/environments/environment';
import { IonModal, Platform } from '@ionic/angular';
import { OverlayEventDetail } from '@ionic/core/components';
import { AuthService } from 'src/app/services/auth/auth.service';


@Component({
  selector: 'app-cart',
  templateUrl: './cart.page.html',
  styleUrls: ['./cart.page.scss'],
})
export class CartPage implements OnInit {
  @ViewChild(IonModal) modal: IonModal;
  userId: any
  cartData: any = []
  link :any
  mobile: boolean = false

  constructor(private cart: CartService,private plateform: Platform , private auth:AuthService) {
    if (localStorage.getItem('userData')) {

      this.userId = JSON.parse(localStorage.getItem('userData')!)._id
      this.getCart()
    }
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
  handleRefresh(event:any) {
    setTimeout(() => {
      // Any calls to load data go here
      this.getCart()
      event.target.complete();
    }, 2000);
  }
  onWillDismiss(event: Event) {
    const ev = event as CustomEvent<OverlayEventDetail<string>>;
    if (ev.detail.role === 'confirm') {
      // this.message = `Hello, ${ev.detail.data}!`;
      console.log('ok');

    }
  }
  cancel() {
    this.modal.dismiss(null, 'cancel');
  }
  ionViewDidEnter() {
    this.getCart()
  }
  getCart() {
    let obj = {
      userId: this.userId
    }
    this.cart.getCart(obj).subscribe({
      next: (res: any) => {
        if (res) {
          this.cartData = res.body.data
          console.log(this.cartData);

        }
      },
      error: (err) => {
        console.error(err);

      }
    })
  }
  increaseQuantity(product: any) {
    product.quantity++;
    this.updateCart(product);
  }

  decreaseQuantity(product: any) {
    if (product.quantity > 1) {
      product.quantity--;
      this.updateCart(product);
    }
  }


  updateCart(product: any) {
    console.log(product);

    let obj: any = {
      userId: this.userId,
      productId: product.product._id,
      quantity: product.quantity
    }
    this.cart.updateCart(obj).subscribe({
      next: (res) => {
        console.log(res);
        this.getCart()
      },
      error: (err) => {
        console.error(err);

      }
    })

  }

  removeProduct(product: any) {
    console.log(product);

    let obj: any = {
      userId: this.userId,
      productId: product.product._id,
      detailId:product.product.productData[0]._id
    }
    this.cart.removeCart(obj).subscribe({
      next: (res) => {
        console.log(res);
        this.getCart()

      },
      error: (err) => {
        console.error(err);

      }
    })
  }
  getTotalPrice(): number {
    let totalPrice = 0;
    for (const product of this.cartData) {
      console.log(product);
      
      // Assuming product.price is the original price and product.product.discountedPrice is the discounted price
      if(product.product.productData[0].stock > 0){

        totalPrice += product.product.productData[0].discountPrice ? product.product.productData[0].discountPrice * product.quantity : product.product.productData[0].price * product.quantity;
      }
    }
    return totalPrice;
  }

  calculateDiscountPrice(): number {
    let totalPrice = 0;

    for (const product of this.cartData) {

      const price = product.product.productData[0].price;
      const discount = product.product.productData[0].discountPrice;
      const discountedPrice = price * (discount / 100);
      console.log(discountedPrice);
      
    }
    return totalPrice
  }
}
