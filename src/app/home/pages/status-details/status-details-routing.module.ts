import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StatusDetailsPage } from './status-details.page';

const routes: Routes = [
  {
    path: '',
    component: StatusDetailsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StatusDetailsPageRoutingModule {}
