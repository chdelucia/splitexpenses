import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WelcomeRoutingModule } from './welcome-routing.module';
import { WelcomeComponent } from './welcome.component';
import { MatStepperModule } from '@angular/material/stepper';
import { UsersModule } from '@users/users.module';
import { ExpensesModule } from '@expenses/expenses.module';

@NgModule({
  declarations: [WelcomeComponent],
  imports: [
    CommonModule,
    WelcomeRoutingModule,
    MatStepperModule,
    UsersModule,
    ExpensesModule,
  ],
})
export class WelcomeModule {}
