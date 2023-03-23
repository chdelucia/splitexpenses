import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SummarygraphComponent } from './summarygraph/summarygraph.component';
import { NgChartsModule } from 'ng2-charts';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';



@NgModule({
  declarations: [
    SummarygraphComponent,
  ],
  imports: [
    CommonModule,
    NgChartsModule,
    MatSnackBarModule,
    MatInputModule,
    MatIconModule

  ],
  exports:[
    SummarygraphComponent,
    MatSnackBarModule,
    MatInputModule,
    MatIconModule
  ]
})
export class SharedModule { }
