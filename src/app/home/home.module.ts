import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { HomePage } from './home.page';

import { HomePageRoutingModule } from './home-routing.module';
import { CategoriesComponent } from '../components/categories/categories.component';
import { DealsComponent } from '../components/deals/deals.component';
import { FeaturedComponent } from '../components/featured/featured.component';
import { SliderComponent } from '../components/slider/slider.component';
import { HttpClientModule } from '@angular/common/http';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,
    HttpClientModule
  ],
  declarations: [HomePage,DealsComponent,FeaturedComponent,SliderComponent],
  schemas:[CUSTOM_ELEMENTS_SCHEMA]
  
})
export class HomePageModule {}
