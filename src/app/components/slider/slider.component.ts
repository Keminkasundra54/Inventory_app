import { Component, OnInit } from '@angular/core';
import { IonicSlides } from '@ionic/angular';

@Component({
  selector: 'app-slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.scss'],
})
export class SliderComponent  implements OnInit {

  selectedSlide:any
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
  swiperModules = [IonicSlides];
  constructor() { }

  ngOnInit() {}

  selected(data:any){
    this.selectedSlide = data
    console.log(this.selectedSlide);
    
  }
}
