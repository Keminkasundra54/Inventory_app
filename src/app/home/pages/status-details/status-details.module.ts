import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { StatusDetailsPageRoutingModule } from './status-details-routing.module';

import { StatusDetailsPage } from './status-details.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    StatusDetailsPageRoutingModule
  ],
  declarations: [StatusDetailsPage],
  schemas:[CUSTOM_ELEMENTS_SCHEMA]

})
export class StatusDetailsPageModule {}
