import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DebtsRoutingModule } from './debts-routing.module';
import { DebtsComponent } from './debts.component';
import { DebtsDetailComponent } from './debts-detail/debts-detail.component';
import { FormsModule } from '@angular/forms';
import { DebtsService } from './shared/debts.service';
import {MatTableModule} from '@angular/material/table';
import { DebtTracingComponent } from './debt-tracing/debt-tracing.component';
import { SharedModule } from "../shared/shared.module";



@NgModule({
    declarations: [
        DebtsComponent,
        DebtsDetailComponent,
        DebtTracingComponent
    ],
    providers: [
        DebtsService
    ],
    imports: [
        FormsModule,
        CommonModule,
        DebtsRoutingModule,
        MatTableModule,
        SharedModule
    ]
})
export class DebtsModule { }
