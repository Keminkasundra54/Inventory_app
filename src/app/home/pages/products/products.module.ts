import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProductsPageRoutingModule } from './products-routing.module';

import { ProductsPage } from './products.page';
import { CategoriesComponent } from 'src/app/components/categories/categories.component';
import { NotificationModule } from 'src/app/components/notification/notification.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProductsPageRoutingModule,
    NotificationModule
  ],
  declarations: [ProductsPage,CategoriesComponent]
})
export class ProductsPageModule {}
