import { Component, inject } from '@angular/core';
import { CurrencyService } from '@shared/services/currency/currency.service';
import { DebtsService } from './shared/debts.service';
import { CurrencyPlugin, TraceAutoSettle } from '@shared/models';
import { UsersService } from '@users/shared/users.service';
import { KeyValuePipe, DecimalPipe } from '@angular/common';
import { DebtTracingComponent } from './debt-tracing/debt-tracing.component';
import { RouterModule } from '@angular/router';
import { ExchangePipe } from '@shared/pipes/exchange.pipe';

@Component({
  selector: 'app-debts',
  templateUrl: './debts.component.html',
  styleUrls: ['./debts.component.scss'],
  standalone: true,
  imports: [
    KeyValuePipe,
    DecimalPipe,
    DebtTracingComponent,
    RouterModule,
    ExchangePipe,
  ],
})
export class DebtsComponent {
  private debtsService = inject(DebtsService);
  private userService = inject(UsersService);
  private currencyService = inject(CurrencyService);

  debts = this.debtsService.debtsSignal;
  users = this.userService.iterableUsers;
  currency: CurrencyPlugin = this.currencyService.getCurrencySettings();
  debtTracing: TraceAutoSettle[] = this.debtsService.getDebtTracing();
}
