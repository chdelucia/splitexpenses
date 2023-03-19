import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SummarygraphComponent } from './summarygraph/summarygraph.component';
import { NgChartsModule } from 'ng2-charts';
import { MatSnackBarModule } from '@angular/material/snack-bar';



@NgModule({
  declarations: [
    SummarygraphComponent,
  ],
  imports: [
    CommonModule,
    NgChartsModule,
    MatSnackBarModule
  ],
  exports:[
    SummarygraphComponent,
    MatSnackBarModule
  ]
})
export class SharedModule { }
