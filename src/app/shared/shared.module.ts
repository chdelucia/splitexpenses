import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SummarygraphComponent } from './components';
import { NgChartsModule } from 'ng2-charts';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginatorModule } from '@angular/material/paginator';
import { ExchangePipe } from './pipes/exchange.pipe';
import { WrapFnPipe } from './pipes/wrap-fn.pipe';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';

@NgModule({
  declarations: [SummarygraphComponent, ExchangePipe, WrapFnPipe],
  imports: [
    CommonModule,
    NgChartsModule,
    MatSnackBarModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatPaginatorModule,
    NgxSkeletonLoaderModule,
  ],
  exports: [
    SummarygraphComponent,
    MatSnackBarModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatPaginatorModule,
    ExchangePipe,
    WrapFnPipe,
    NgxSkeletonLoaderModule,
  ],
})
export class SharedModule {}
