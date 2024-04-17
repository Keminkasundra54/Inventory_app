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
  colorList: any = []
  sizeList: any = []
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

          if (res.body.data[0] && res.body.data[0].productData){

            this.selectedInrProductData = res.body.data[0].productData[0]
            console.log(this.selectedInrProductData, 'firstinit');
            // this.setSelectedProduct(this.selectedInrProductData.color)
          this.extractSizesAndColors(this.productData.productData)
          }
        }
      },
      error: (err) => {
        console.error(err);

      }
    })
  }
  setSelectedProduct(color:any) {
    console.log(this.productData);
    
    let mainColor:any = []
    this.productData.productData.forEach((product: any) => {
      console.log(product);
      console.log(color);
      
      if(product.color == color){
        console.log(product, 'inr');
        mainColor.push(product)
      }
      console.log(mainColor);
      
      
      // if (product._id == id) {
      //   this.selectedInrProductData = product
      console.log(this.productData);
      
      // }
      if (mainColor.length > 0) {
        this.selectedInrProductData = mainColor[0];
        console.log('Selected Product:', this.selectedInrProductData); // Log selectedInrProductData
        this.extractSizesAndColors(this.productData.productData);
    }
      // this.selectedInrProductData = mainColor[0]
      // console.log(this.selectedInrProductData);

      // this.extractSizesAndColors(this.productData.productData)
    });
  }
  selectSize(id:any, color:any){
    console.log(this.productData);
      console.log(id);
      
    let mainColor:any = []
    this.productData.productData.forEach((product: any) => {
      console.log(product);
      console.log(this.selectedInrProductData);
      console.log(product._id);
      console.log(id);
      console.log(product.color);
      console.log(this.selectedInrProductData.color);
      
      if(product._id == id && product.color == color){
        console.log(product, 'inr');
        mainColor.push(product)
        console.log(mainColor);
      }
      
      // this.selectedInrProductData = mainColor[0]
      // console.log(this.selectedInrProductData,'selected product');
      if (mainColor.length > 0) {
        this.selectedInrProductData = mainColor[0];
        console.log('Selected Product:', this.selectedInrProductData); // Log selectedInrProductData
        this.extractSizesAndColors(this.productData.productData);
    }
      // if (product._id == id) {
      //   this.selectedInrProductData = product
        // this.extractSizesAndColors(this.productData.productData)
      // }
    });
    
  }
  extractSizesAndColors(products: any) {
    console.log('extractSizesAndColors - selectedInrProductData:', this.selectedInrProductData); // Log selectedInrProductData
    console.log('extractSizesAndColors - products:', products); // Log products array
    // Rest 
       this.colorList = [];
       this.sizeList = [];
    for (const product of products) {

      console.log(product);

      if (product) {

        
        if (product && !this.colorList.find((x:any) => x.color === product.color)) {
          this.colorList.push(product);
        }
      }
      console.log(this.colorList);

      
      
      // this.selectedInrProductData = this.colorList[0]
    }   
    console.log(this.selectedInrProductData);
    let productsWithSelectedColor
      
        productsWithSelectedColor = products.filter((product:any) => product.color === this.selectedInrProductData.color);
        console.log(this.selectedInrProductData);
  
    //   for (const product of productsWithSelectedColor) {

    //     if (product && !this.sizeList.includes({_id:product._id,size:product.size})) {
    //       this.sizeList.push(product.size);
    //     }
    //   }
    // console.log(this.sizeList);
    for (const product of productsWithSelectedColor) {
      // Checking if the product size with id is not already in the size list
      if (!this.sizeList.find((size:any) => size._id === product._id && size.size === product.size)) {
          this.sizeList.push(product);
      }
  }
  console.log(this.sizeList);
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
      console.log(inrId);
      
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

 
}
