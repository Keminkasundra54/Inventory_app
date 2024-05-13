import { Component, OnInit, ViewChild, effect } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, IonModal, Platform, ToastController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth/auth.service';
import { CartService } from 'src/app/services/cart/cart.service';
import { OrderService } from 'src/app/services/order/order.service';
import { ProfileService } from 'src/app/services/profile/profile.service';
import { PromocodeService } from 'src/app/services/promocode/promocode.service';
import { environment } from 'src/environments/environment';
import { AnimationItem } from 'lottie-web';
import { LottieComponent, AnimationOptions } from 'ngx-lottie';
import { OverlayEventDetail } from '@ionic/core/components';
import { Router } from '@angular/router';
import { Checkout } from 'capacitor-razorpay';
@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.page.html',
  styleUrls: ['./checkout.page.scss'],
  providers: [OrderService]
})
export class CheckoutPage implements OnInit {
  userId: any
  cartData: any = []
  userInfo: any = []
  oldAddressData: any = []
  addressForm: FormGroup
  selectedAddress: any
  link: any
  mobile: boolean = false
  promoCode: any = null
  razorPayOrderData: any
  promoForm: FormGroup
  // paymentScreen: boolean = false
  // success: boolean = false
  // failed: boolean = false
  // loader: boolean = false
  constructor(
    private cart: CartService,
    private profile: ProfileService,
    private fb: FormBuilder,
    private plateform: Platform,
    private order: OrderService,
    private promoService: PromocodeService,
    private router: Router,
    private toastController: ToastController,
    private alertController: AlertController,
    private auth: AuthService) {
    effect(() => {
      this.link = this.auth.url()
    })
    if (localStorage.getItem('userData')) {

      this.userId = JSON.parse(localStorage.getItem('userData')!)._id
      this.getCart()
    }
    this.oldAddressData = [];

    this.addressForm = this.fb.group({
      apartment: [, Validators.required],
      address: [, Validators.required],
      city: [, Validators.required],
      state: [, Validators.required],
      country: [, Validators.required],
      zip: [, Validators.required],
    })

    this.promoForm = this.fb.group({
      promo: [, Validators.required]
    })
    if (this.plateform.is('android') || this.plateform.is('ios') || this.plateform.is('tablet') || this.plateform.is('ipad')) {
      this.mobile = true
      console.log(this.mobile);

    }
  }
  @ViewChild(IonModal) modal: IonModal;

  cancel() {
    this.modal.dismiss(null, 'cancel');
  }

  confirm() {
    this.modal.dismiss(null, 'confirm');
  }

  onWillDismiss(event: Event) {
    const ev = event as CustomEvent<OverlayEventDetail<string>>;
    if (ev.detail.role === 'confirm') {
      // this.message = `Hello, ${ev.detail.data}!`;
    }
  }
  ngOnInit() {
    this.getCart()
    this.getProfile()
  }
  ionViewDidEnter() {
    this.getCart()
    this.getProfile()

  }
  handleRefresh(event: any) {
    setTimeout(() => {
      // Any calls to load data go here
      this.getCart()
      this.getProfile()
      event.target.complete();
    }, 2000);
  }
  options: AnimationOptions = {
    path: '../../../../assets/payment/paymentSuccessfull.json',
  };

  animationCreated(animationItem: any): void {
    console.log(animationItem);
  }
  getCart() {
    let obj = {
      userId: this.userId
    }
    this.cart.getCart(obj).subscribe({
      next: (res: any) => {
        if (res) {
          let dummy = [...res.body.data]
          // this.cartData = res.body.data
          console.log(this.cartData);
          this.cartData = dummy.filter((product) => {
            return (product.product.productData[0].stock > 0)
          });
          // this.cartData.filter((value:any)=> value.product.stock > 0)

        }
      },
      error: (err) => {
        console.error(err);

      }
    })
  }
  getProfile() {
    let obj = {
      userId: this.userId
    }
    this.profile.getProfile(obj).subscribe({
      next: (res: any) => {
        if (res) {
          this.userInfo = res.body.data
          console.log(this.userInfo);
          if (res.body.data.address) {

            this.oldAddressData = res.body.data.address

            this.selectedAddress = this.oldAddressData[0]._id
          }
        }
      },
      error: (err) => {
        console.error(err);

      }
    })
  }

  // get adddressControls() {

  //   return (<FormArray>this.addressForm.get('address')).controls
  // }
  // getAddressess(): any {
  //   return (this.addressForm.get('address') as FormArray).controls;
  // }
  // addAddress() {
  //   const address = this.addressForm.get('address') as FormArray;
  //   address.push(this.fb.control('', [Validators.required]));
  // }
  getMainPrice(): number {
    let totalPrice = 0;
    for (const product of this.cartData) {
      // Assuming product.price is the original price and product.product.productData[0].discountedPrice is the discounted price
      if (product.product.productData[0].stock > 0) {

        totalPrice += product.product.productData[0].price * product.quantity;
      }
    }

    return totalPrice;
  }
  getTotalPrice(): number {
    let totalPrice = 0;
    let mainPrice = 0
    for (const product of this.cartData) {
      if (product.product.productData[0].stock > 0) {

        totalPrice += product.product.productData[0].discountPrice ? product.product.productData[0].discountPrice * product.quantity : product.product.productData[0].price * product.quantity;
      }
    }
    if (this.promoCode && this.promoCode.isActive) {
      if (this.promoCode.type == 'flat') {
        console.log('yes flat calling');

        console.log(totalPrice, this.promoCode.amount);
        if (totalPrice > this.promoCode.amount) {
          totalPrice -= this.promoCode.amount;
          // this.promoForm.markAsUntouched();

        } else {
          // this.promoForm.reset()
          this.promoForm.markAllAsTouched();
          // this.promoCode = null
        }
      } else if (this.promoCode.type == 'percentage') {
        console.log('yes percent calling');

        const discountAmount = (totalPrice * this.promoCode.amount) / 100;
        if (totalPrice > discountAmount) {
          totalPrice -= discountAmount;
          // this.promoForm.markAsUntouched();

        } else {
          // this.promoForm.reset()

          this.promoForm.markAllAsTouched();
          // this.promoCode = null
        }
      }
    }
    return totalPrice;
  }
  calculateDiscountPrice(): number {
    let totalDiscountPrice = 0;

    for (const product of this.cartData) {
      if (product.product.productData[0].stock > 0) {

        const price = product.product.productData[0].price;
        const discountPercentage = product.product.productData[0].discount;
        console.log(price, discountPercentage);

        if (discountPercentage && discountPercentage < 100) {
          const discountAmount = (price * discountPercentage) * product.quantity / 100;

          totalDiscountPrice += discountAmount;
        }
      }
    }

    return totalDiscountPrice;
  }
  applyPromocode() {
    if (this.promoForm.valid) {
      let obj = {
        Promocode: this.promoForm.value.promo,
        userId: this.userId
      }
      this.promoService.searchPromoCode(obj).subscribe({
        next: (res: any) => {
          if (res) {
            console.log(res);
            if (res.body.data == 'please try again') {
              this.promoForm.reset()
              this.promoForm.markAllAsTouched();
              return;
            } else {
              this.promoCode = res.body.data
              if (this.promoCode.isActive) {

                this.getTotalPrice()
              } else {
                this.promoCode = null
              }
            }
          }
        },
        error: (err) => {
          console.error(err);
          this.promoForm.reset()
          this.promoForm.markAllAsTouched();
        }
      })
    }
  }
  promocode(): number {
    let price = 0;

    if (this.promoCode && this.promoCode.isActive) {

      if (this.promoCode.type == 'flat') {

        price = this.promoCode.amount

      } else if (this.promoCode.type === 'percentage') {


        let totalPrice = 0;
        for (const product of this.cartData) {

          if (product.product.productData[0].stock > 0) {

            // totalPrice += product.product.productData[0].price * product.quantity;
            totalPrice += product.product.productData[0].discountPrice ? product.product.productData[0].discountPrice * product.quantity : product.product.productData[0].price * product.quantity;
          }
        }

        const discountAmount = (totalPrice * this.promoCode.amount) / 100;
        price = discountAmount;
      }


    }

    return price;
  }

  newAddress() {
    let obj = {
      userId: this.userId,
      apartment: this.addressForm.value.apartment,
      address: this.addressForm.value.address,
      city: this.addressForm.value.city,
      state: this.addressForm.value.state,
      country: this.addressForm.value.country,
      zip: this.addressForm.value.zip,
    }
    this.profile.addAddress(obj).subscribe({
      next: (res: any) => {
        if (res) {
          this.getProfile()
        }
      }, error: (err) => {
        console.error(err);

      }
    })
  }
  addOptions(event: any) {
    console.log(event);
    this.selectedAddress = event.detail.value
  }

  createRpOrder() {
    if (this.selectedAddress) {
      let amount = this.getTotalPrice()
      let obj = {
        amount
      }
      this.order.createRpOrder(obj).subscribe({
        next: (res: any) => {
          if (res) {
            console.log(res);
            if (res) {

              this.razorPayOrderData = res.body.data
              if (environment.enablePaymentGateway) {
                // this.loader = true
                // this.payWithRazor(this.razorPayOrderData)
                this.payWithRazorpay(this.razorPayOrderData)
              }
            }
          }
        },
        error: (err) => {
          console.error(err);

        }
      })
    }
  }
  payWithRazor(data: any) {

    const options: any = {

      key: environment.razorPayKey,

      amount: data.amount,

      currency: 'INR',
      prefill: {
        email: this.userInfo.email,
        contact: this.userInfo.phone,
      },
      name: this.userInfo.firstName + ' ' + this.userInfo.lastName,

      description: '',  // product description

      image: this.userInfo.profilePic[0], // company logo or product image

      order_id: data.id, // order_id created by you in backend

      modal: {

        // We should prevent closing of the form when esc key is pressed.

        escape: false,

      },

      notes: {

        // include notes if any

      },

      theme: {

        color: '#0c238a'

      }

    };

    options.handler = ((response: any, error: any) => {

      options.response = response;

      console.log(response);

      console.log(options);

      let orderData: any = []

      console.log(this.cartData);


      for (let i = 0; i < this.cartData.length; i++) {
        const product = this.cartData[i];
        let inrObj = {
          productId: product.product.productData[0]._id,
          quantity: product.quantity
        }

        orderData.push(inrObj)
      }
      let obj = {
        orderData,
        userId: this.userId,
        firstName: this.userInfo.firstName,
        lastName: this.userInfo.lastName,
        phoneNumber: this.userInfo.phone,
        address: this.selectedAddress,
        transactionData: response,
        totalAmount: this.getTotalPrice(),
        promoCode: this.promoForm.value.promo
      }
      if (response) {
        this.order.addOrder(obj).subscribe({
          next: (res: any) => {
            if (res) {

              console.log(res);

              this.router.navigate(['status'])
              this.presentToast('middle', 'Order Confirmed.!!', 'success')
            }

          },
          error: (err) => {
            console.error(err);

            this.presentToast('middle', 'Something went Wrong.!!', 'danger')

            console.log('Transaction cancelled.');

          }
        })
      }
      // call your backend api to verify payment signature & capture transaction

    });

    options.modal.ondismiss = (() => {

      // handle the case when user closes the form while transaction is in progress
      // this.paymentScreen = true
      // this.loader = false
      // this.failed = true
      // // console.log(this.paymentScreen);

      // setTimeout(() => {
      //   this.paymentScreen = false;
      //   this.success = false;
      //   this.failed = false;
      //   console.log(this.paymentScreen);
      //   console.log(this.success);
      //   console.log(this.failed);
      //   console.log('Transaction cancelled.');
      //     this.loader = false
      // }, 7000);
      this.presentToast('middle', 'Transaction cancelled.', 'danger')

      console.log('Transaction cancelled.');

    });

    const rzp = new this.order.nativeWindow.Razorpay(options);

    rzp.open();


  }

  async presentToast(position: 'top' | 'middle' | 'bottom', message: any, color: 'success' | 'danger') {
    const toast = await this.toastController.create({
      message: message,
      duration: 1500,
      color: color,
      position: position,
    });

    await toast.present();
  }




  async payWithRazorpay(data: any) {
    const options = {
      key: environment.razorPayKey,
      amount: data.amount,
      description: '',
      image: this.userInfo.profilePic[0],
      order_id: data.id,//Order ID generated in Step 1
      currency: 'INR',
      name: this.userInfo.firstName + ' ' + this.userInfo.lastName,
      prefill: {
        email: this.userInfo.email,
        contact: this.userInfo.phone,
      },
      theme: {
        color: '#127FFF'
      }
    }
    try {
      let data = (await Checkout.open(options));
      console.log(data);
      console.log(data.response);


      console.log(data.response + "AcmeCorp");
      console.log(JSON.stringify(data))
      let orderData: any = []

      console.log(this.cartData);


      for (let i = 0; i < this.cartData.length; i++) {
        const product = this.cartData[i];
        let inrObj = {
          productId: product.product._id,
          detailId: product.product.productData[0]._id,
          quantity: product.quantity
        }

        orderData.push(inrObj)
      }
      let obj = {
        orderData,
        userId: this.userId,
        firstName: this.userInfo.firstName,
        lastName: this.userInfo.lastName,
        phoneNumber: this.userInfo.phone,
        address: this.selectedAddress,
        transactionData: data.response,
        totalAmount: this.getTotalPrice(),
        promoCode: this.promoForm.value.promo
      }
      if (data.response) {
        this.order.addOrder(obj).subscribe({
          next: (res: any) => {
            if (res) {

              console.log(res);
              // this.paymentScreen = true
              // this.success = true
              // this.loader = false


              // setTimeout(() => {
              //   this.paymentScreen = false
              //   this.success = false
              //   this.failed = false
              //   console.log(this.paymentScreen);
              //   console.log(this.success);
              //   console.log(this.failed);
              //   console.log('Transaction cancelled.');
              //     this.loader = false
              // }, 10000);
              this.presentToast('middle', 'Order Confirmed.!!', 'success')
              this.router.navigate(['status'])
            }

          },
          error: (err) => {
            console.error(err);

            // this.paymentScreen = true
            // this.loader = false
            // this.failed = true

            // setTimeout(() => {
            //   this.paymentScreen = false
            //   this.success = false
            //   this.failed = false
            //   console.log(this.paymentScreen);
            //   console.log(this.success);
            //   console.log(this.failed);
            //   console.log('Transaction cancelled.');
            //     this.loader = false
            // }, 7000);
            this.presentToast('middle', 'Something went Wrong.!!', 'danger')

            console.log('Transaction cancelled.');

          }
        })

      }
    } catch (error: any) {
      //it's paramount that you parse the data into a JSONObject
      let errorObj = JSON.parse(error['code'])
      // alert(errorObj.description);
      // alert(errorObj.code);

      // alert(errorObj.reason);
      // alert(errorObj.step);
      // alert(errorObj.source);
      // alert(errorObj.metadata.order_id);
      // alert(errorObj.metadata.payment_id);
      this.presentToast('middle', 'Transaction cancelled.', 'danger')

    }
  }
  async presentAlert(response: any) {
    // let responseObj = JSON.parse(response)
    console.log("message" + response['razorpay_payment_id']);
    const alert = await this.alertController.create({
      message: response['razorpay_payment_id'],
      backdropDismiss: true,
    });

    await alert.present();
  }
}
