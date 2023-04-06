import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DebtsComponent } from './debts.component';
import { DebtsDetailComponent } from './debts-detail/debts-detail.component';

const routes: Routes = [
  { path: '', component: DebtsComponent },
  { path: 'details', component: DebtsDetailComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DebtsRoutingModule { }
