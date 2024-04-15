import { Component, Input, OnInit, PlatformRef, effect } from '@angular/core';
import { Router } from '@angular/router';
import { IonicSlides } from '@ionic/angular';
import { Platform } from '@ionic/angular';
import { CategoryService } from 'src/app/services/category/category.service';
import { environment } from 'src/environments/environment';
import { Output, EventEmitter } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';
@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss'],
})
export class CategoriesComponent implements OnInit {
  selectedCat: any
  mobile: boolean = false
  categories: any = []
  swiperModules = [IonicSlides];
  link: any
  showAll: boolean = false
  @Output() selectedCatFun = new EventEmitter<string>();

  constructor(private plateform: Platform, private category: CategoryService, private router: Router, private auth: AuthService) {
    effect(() => {
      this.link = this.auth.url()
      this.getCategories()
    })

  }

  ngOnInit() {
    this.getCategories()
    if (this.plateform.is('android')) {
      this.mobile = true
      console.log(this.mobile);

    }
   
  }
  ionViewDidEnter() {
    this.getCategories()

  }
  selected(data: any) {
    this.selectedCat = data
    console.log(this.selectedCat);
    // this.router.navigate(['products', this.selectedCat._id])

    this.selectedCatFun.emit(data._id);
  }

  getCategories() {
    let obj = {
      storeId: environment.store1
    }
    this.category.getCategoryByStore(obj).subscribe({
      next: (res: any) => {
        if (res) {
          console.log(res.body.data);

          this.categories = res.body.data
        }
      },
      error: (err) => {
        console.error(err);

      }
    })
  }
}
