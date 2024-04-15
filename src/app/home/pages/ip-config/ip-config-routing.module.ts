import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { IpConfigPage } from './ip-config.page';

const routes: Routes = [
  {
    path: '',
    component: IpConfigPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class IpConfigPageRoutingModule {}
