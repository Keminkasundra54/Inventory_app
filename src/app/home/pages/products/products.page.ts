import { Component, OnInit, ViewChild, effect } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { InfiniteScrollCustomEvent, MenuController, Platform } from '@ionic/angular';
import { ProductService } from 'src/app/services/product/product.service';
import { environment } from 'src/environments/environment';
import { IonModal } from '@ionic/angular';
import { OverlayEventDetail } from '@ionic/core/components';
import { NotificationService } from 'src/app/services/notification/notification.service';
import { LoaderService } from 'src/app/services/loader/loader.service';
import { AuthService } from 'src/app/services/auth/auth.service';
@Component({
  selector: 'app-products',
  templateUrl: './products.page.html',
  styleUrls: ['./products.page.scss'],
})
export class ProductsPage implements OnInit {
  @ViewChild(IonModal) modal: IonModal;
  data: any = [];
  results: any = [];
  products: any = []
  perPageCount: any = 4
  link: any
  selectedCatId: string = ''
  categoryName: string = ''
  minValue: number = 0
  maxValue: number = 0
  mobile: boolean = false
  sizes: any = []
  colors: any = []
  // checkedSize: string = ''
  // checkedColor: string = ''
  selectedSizes: string[] = [];
  selectedColors: string[] = [];
  selMinRange: any
  selMaxRange: any
  priceObj: any
  userId: any
  user: any
  notification: any = []
  constructor(
    private product: ProductService,
    private router: Router,
    private route: ActivatedRoute,
    private plateform: Platform,
    private menuController: MenuController,
    private noti: NotificationService,
    private auth: AuthService
  ) {

    effect(() => {
      this.link = this.auth.url()

      this.user = this.auth.userData()
      console.log(this.user);
      this.userId = this.user._id
      if (localStorage.getItem('userData')) {

        this.userId = JSON.parse(localStorage.getItem('userData')!)._id
      }
      if (this.auth.menuSignal()) {
        this.openSecondMenu()

      }

    })

    this.selectedCatId = this.route.snapshot.paramMap.get('id')!;

    if (this.selectedCatId) {

      this.getProduct(this.selectedCatId)
    } else {
    }

    if (localStorage.getItem('userData')) {

      this.userId = JSON.parse(localStorage.getItem('userData')!)._id
    }
    this.menuController.close()

    console.log('constructor called');

  }
  handleRefresh(event: any) {
    setTimeout(() => {
      // Any calls to load data go here
      this.selectedCatId = ''
      this.getProducts()
      event.target.complete();
    }, 2000);
  }

  handleInput(event: any) {
    const query = event.target.value.toLowerCase();
    this.results = this.data.filter((d: any) => d.productName.toLowerCase().indexOf(query) > -1);
  }
  openFirstMenu() {
    this.menuController.open('first-menu');
  }
  openSecondMenu() {
    if (localStorage.getItem('userData')) {

      this.userId = JSON.parse(localStorage.getItem('userData')!)._id
    }
    this.menuController.open('second-menu');

  }
  ngOnInit() {
    if (this.plateform.is('android') || this.plateform.is('ios') || this.plateform.is('tablet') || this.plateform.is('ipad')) {
      this.mobile = true
      console.log(this.mobile);

    }
    // this.getProducts()
    if (localStorage.getItem('userData')) {

      this.userId = JSON.parse(localStorage.getItem('userData')!)._id
    }
    console.log('init called');

  }
  ionViewDidEnter() {
    if (localStorage.getItem('userData')) {

      this.userId = JSON.parse(localStorage.getItem('userData')!)._id

    }

    console.log('yesss i m in')
    if (this.selectedCatId) {
      this.getProduct(this.selectedCatId)
    } else {
      this.getProducts()
    }
    this.menuController.close()

  }
  getProduct(id: any) {
    this.selectedCatId = id
    let obj = {
      categoryId: this.selectedCatId
    }
    this.product.getProductByCategory(obj).subscribe({
      next: (res: any) => {
        if (res) {

          this.data = res.body.data

          this.products = res.body.data
          console.log(this.products);

          this.categoryName = this.products[0].categoryName
          this.batch()

          let minmax = this.findMinMax(this.products)
          console.log({ minmax });

          this.minValue = minmax[0]
          this.maxValue = minmax[1]

          this.extractSizesAndColors(this.products);
        }

      }, error: (err) => {
        console.error(err);

      },
    })
  }
  sidemenuclose() {
    console.log('yes called');

    this.auth.menuSignal.set(false)
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
  closeMenu() {
    this.menuController.close()

  }
  getProducts() {
    let obj = {
      storeId: environment.store1
    }
    this.product.getProductByStore(obj).subscribe({
      next: (res: any) => {
        if (res) {
          this.data = res.body.data
          this.results = [...this.data]
          // this.products = this.data
          this.batch()
          console.log(this.products);

          let minmax = this.findMinMax(this.data)
          this.minValue = minmax[0]
          this.maxValue = minmax[1]
          console.log({ minmax });

          this.extractSizesAndColors(this.data);
        }
      }
    })
  }
  batch() {
    const startIndex = this.products.length;
    const endIndex = startIndex + this.perPageCount;
    const batch = this.data.slice(startIndex, endIndex);
    // Add the batch to the products array
    this.products.push(...batch);
    console.log(this.products, 'updated');

  }
  onIonInfinite(ev: any) {
    // this.getProducts()
    this.batch()
    setTimeout(() => {
      (ev as InfiniteScrollCustomEvent).target.complete();
    }, 500);
  }
  findMinMax(arr: any) {
    let min = arr[0].price, max = arr[0].price;

    for (let i = 1, len = arr.length; i < len; i++) {
      let v = arr[i].price;
      min = (v < min) ? v : min;
      max = (v > max) ? v : max;
    }
    console.log(min, max);

    return [min, max];
  }
  selectedCat(event: any) {
    console.log(event, 'yessssss');
    this.getProduct(event)
  }
  extractSizesAndColors(products: any[]) {
    for (const product of products) {
      // Extract size
      console.log(product);
      if(product.size){

        product.size.forEach((size: any) => {
  
          if (size && !this.sizes.includes(size)) {
            this.sizes.push(size);
          }
        })
      }
      // Extract color
      if(product.color){

      product.color.forEach((color: any) => {

        if (color && !this.colors.includes(color)) {
          this.colors.push(color);
        }
      });
    }

    }
  }

  range(event: any) {
    let value = event.target.value
    this.selMinRange = value.lower
    this.selMaxRange = value.upper
    this.priceObj = {
      pricefrom: value.lower,
      priceto: value.upper
    }

    if (!this.mobile) {

      this.applyFilters()
    }
  }

  onSizeCheckboxChange(size: string, event: any) {
    const isChecked = event.detail.checked;
    if (isChecked) {
      this.selectedSizes.push(size);
    } else {
      const index = this.selectedSizes.indexOf(size);
      if (index !== -1) {
        this.selectedSizes.splice(index, 1);
      }
    }
    if (!this.mobile) {

      this.applyFilters()
    }
  }

  onColorCheckboxChange(color: string, event: any) {
    const isChecked = event.detail.checked;
    if (isChecked) {
      this.selectedColors.push(color);
    } else {
      const index = this.selectedColors.indexOf(color);
      if (index !== -1) {
        this.selectedColors.splice(index, 1);
      }
    }
    if (!this.mobile) {

      this.applyFilters()
    }
  }
  applyFilters() {
    let obj: any = {};
    if (this.selectedSizes.length > 0) {
      obj['size'] = this.selectedSizes;
    }
    if (this.selectedColors.length > 0) {
      obj['color'] = this.selectedColors;
    }
    // if (this.priceObj) {
    //   obj = this.priceObj

    // }
    if (this.priceObj) {
      obj['pricefrom'] = this.priceObj.pricefrom;
      obj['priceto'] = this.priceObj.priceto;
    }
    this.product.getProductByFilter(obj).subscribe({
      next: (res: any) => {
        if (res) {
          this.products = res.body.data;
        }
      },
      error: (err) => {
        console.error(err);
      },
    });
  }
  submit() {

    this.applyFilters()
    this.menuController.close()

  }
  login() {
    this.router.navigate(['login'])
    this.menuController.close()

  }
  profile() {
    this.router.navigate(['profile'])
    this.menuController.close()
  }
  status() {
    this.router.navigate(['status'])
    this.menuController.close()
  }
  logOut() {
    localStorage.removeItem('userData')
    this.userId = null
    this.router.navigate([''])
    this.menuController.close()
  }
}
