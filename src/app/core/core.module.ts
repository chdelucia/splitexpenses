import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthGuard } from './auth.guard';
import { NavbarComponent } from './navbar/navbar.component';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [NavbarComponent],
  imports: [RouterModule, CommonModule],
  providers: [AuthGuard],
  exports: [NavbarComponent],
})
export class CoreModule {}
