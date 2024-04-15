import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IonicSlides, Platform } from '@ionic/angular';

@Component({
  selector: 'app-deals',
  templateUrl: './deals.component.html',
  styleUrls: ['./deals.component.scss'],
})
export class DealsComponent implements OnInit {
  selectedDeal: any
  swiperModules = [IonicSlides];
  mobile:boolean = false
  categories = [
    {
      id: 1,
      img: '../../../assets/images/cr1.jpg',
      title: 'titles'
    },
    {
      id: 2,
      img: '../../../assets/images/cr2.jpg',
      title: 'titles'
    },
    {
      id: 3,
      img: '../../../assets/images/cr3.jpg',
      title: 'titles'
    },
    {
      id: 4,
      img: '../../../assets/images/cr4.jpg',
      title: 'titles'
    },
    {
      id: 5,
      img: '../../../assets/images/cr5.jpg',
      title: 'titles'
    },

  ]
  constructor(router:Router, private plateform:Platform) { }

  ngOnInit() {
    if(this.plateform.is('android') || this.plateform.is('ios') || this.plateform.is('tablet') || this.plateform.is('ipad')){
      this.mobile = true
      console.log(this.mobile);
      
    }
   }

  selected(data: any) {
    this.selectedDeal = data
    console.log(this.selectedDeal);

  }
  dealsPage(){
    
  }
}
