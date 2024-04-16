import { Component, OnInit, effect } from '@angular/core';
import { ActivatedRoute, Router, RoutesRecognized } from '@angular/router';
import { IonicSlides } from '@ionic/angular';
import { CartService } from 'src/app/services/cart/cart.service';
import { ProductService } from 'src/app/services/product/product.service';
import { WishlistService } from 'src/app/services/wishlist/wishlist.service';
import { environment } from 'src/environments/environment';
import { filter, pairwise } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth/auth.service';
@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.page.html',
  styleUrls: ['./product-details.page.scss'],
})
export class ProductDetailsPage implements OnInit {
  selectedProduct: any
  productData: any = []
  selectedInrProductData: any = []
  swiperModules = [IonicSlides];
  link: any
  userId: any
  prevUrl: boolean = false
  isToastOpen = false;
  wishListData: any = []
  cartListData: any = []
  wishList: boolean = false
  cartBool: boolean = false
  constructor(private route: ActivatedRoute, private product: ProductService, private wishlist: WishlistService, private cart: CartService, private router: Router, private auth: AuthService) {
    effect(() => {
      this.link = this.auth.url()
    })

  }

  ngOnInit() {

    if (localStorage.getItem('userData')) {

      this.userId = JSON.parse(localStorage.getItem('userData')!)._id
    }
    if (this.userId) {
      this.getWishlist()
      this.getCartlist()
    }
  }
  handleRefresh(event: any) {
    setTimeout(() => {
      // Any calls to load data go here
      this.getWishlist()
      this.getCartlist()
      if (this.selectedProduct) {
        this.getProduct(this.selectedProduct)
      }
      event.target.complete();
    }, 2000);
  }
  ionViewDidEnter() {
    this.router.events
      .pipe(filter((evt: any) => evt instanceof RoutesRecognized), pairwise())
      .subscribe((events: RoutesRecognized[]) => {
        console.log('previous url', events[0].urlAfterRedirects);
        if (events[0].urlAfterRedirects == '/cart') {
          this.prevUrl = true
          console.log(this.prevUrl);

        } else {
          this.prevUrl = false
        }
        console.log('current url', events[1].urlAfterRedirects);
      });

    this.selectedProduct = this.route.snapshot.paramMap.get('id')!;
    console.log(this.selectedProduct,);

    if (this.selectedProduct) {
      this.getProduct(this.selectedProduct)
    }

    if (localStorage.getItem('userData')) {

      this.userId = JSON.parse(localStorage.getItem('userData')!)._id
    }

    if (this.userId) {
      this.getWishlist()
      this.getCartlist()
    }
  }
  getProduct(id: any) {
    let obj = {
      productId: id
    }
    this.product.getProduct(obj).subscribe({
      next: (res: any) => {
        if (res) {
          this.productData = res.body.data[0]

          if (res.body.data[0] && res.body.data[0].productData)
            this.selectedInrProductData = res.body.data[0].productData[0]

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

                if (value._id == this.selectedProduct) {
                  this.wishList = true
                } else {
                  this.wishList = false
                }
              }
            });
          } else {
            this.wishList = false

          }
        }
      },
      error: (err) => {
        console.error(err);

      }
    })
  }
  getCartlist() {
    let obj = {
      userId: this.userId
    }
    this.cart.getCart(obj).subscribe({
      next: (res: any) => {
        if (res) {
          console.log(res);

          this.cartListData = res.body.data
          console.log(this.cartListData);
          if (this.cartListData.length) {

            this.cartListData.forEach((value: any) => {
              if (value.product._id == this.selectedProduct) {
                this.cartBool = true
              } else {
                this.cartBool = false
              }
            });
          } else {
            this.cartBool = false
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
            this.getProduct(this.selectedProduct)
            this.getWishlist()
          }
        },
        error: (err) => {
          console.error(err);

        }
      })
    } else {
      this.isToastOpen = true;

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
          this.getProduct(this.selectedProduct)
          this.getWishlist()
        }
      },
      error: (err) => {
        console.error(err);

      }
    })
  }
  addToCart(id: any, inrId: any) {
    if (this.userId) {
      let obj = {
        productId: id,
        detailId: inrId,
        userId: this.userId
      }
      this.cart.addToCart(obj).subscribe({
        next: (res: any) => {
          if (res) {
            // this.getProduct(this.selectedProduct)
            console.log(res);
            this.getProduct(this.selectedProduct)
            this.getCartlist()
          }
        },
        error: (err) => {
          console.error(err);

        }
      })

    } else {
      this.isToastOpen = true;

    }
  }
  buyNow(id: any, inrId: any) {
    if (this.userId) {
      let obj = {
        productId: id,
        detailId: inrId,
        userId: this.userId
      }
      this.cart.addToCart(obj).subscribe({
        next: (res: any) => {
          if (res) {
            // this.getProduct(this.selectedProduct)
            console.log(res);
            this.getProduct(this.selectedProduct)
            this.getCartlist()


            this.router.navigate(['checkout'])
          }
        },
        error: (err) => {
          console.error(err);

        }
      })

    } else {
      this.isToastOpen = true;

    }

  }

  setSelectedProduct(id: any) {
    this.productData.productData.forEach((product:any) => {
        if(product._id == id){
          this.selectedInrProductData = product
        }
    });
  }
}
