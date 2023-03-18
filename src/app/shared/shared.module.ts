import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SummarygraphComponent } from './summarygraph/summarygraph.component';
import { NgChartsModule } from 'ng2-charts';



@NgModule({
  declarations: [
    SummarygraphComponent,
  ],
  imports: [
    CommonModule,
    NgChartsModule,
  ],
  exports:[
    SummarygraphComponent
  ]
})
export class SharedModule { }
