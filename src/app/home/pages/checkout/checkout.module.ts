import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CheckoutPageRoutingModule } from './checkout-routing.module';

import { CheckoutPage } from './checkout.page';

import { provideLottieOptions } from 'ngx-lottie';
import player from 'lottie-web';

export function playerFactory(){
  return player
}
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CheckoutPageRoutingModule,
    ReactiveFormsModule,
    
  ],
  declarations: [CheckoutPage],
  schemas:[CUSTOM_ELEMENTS_SCHEMA],
  providers:[]
})
export class CheckoutPageModule {}
