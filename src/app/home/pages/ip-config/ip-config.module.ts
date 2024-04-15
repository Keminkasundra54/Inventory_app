import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { IpConfigPageRoutingModule } from './ip-config-routing.module';

import { IpConfigPage } from './ip-config.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    IpConfigPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [IpConfigPage]
})
export class IpConfigPageModule {}
