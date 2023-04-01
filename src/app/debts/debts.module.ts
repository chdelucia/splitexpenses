import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DebtsRoutingModule } from './debts-routing.module';
import { DebtsComponent } from './debts.component';
import { DebtsDetailComponent } from './debts-detail/debts-detail.component';
import { FormsModule } from '@angular/forms';
import { DebtsService } from './shared/debts.service';


@NgModule({
  declarations: [
    DebtsComponent,
    DebtsDetailComponent
  ],
  imports: [
    FormsModule,
    CommonModule,
    DebtsRoutingModule
  ],
  providers: [
    DebtsService
  ]
})
export class DebtsModule { }
