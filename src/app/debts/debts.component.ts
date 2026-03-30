import { Component, inject } from '@angular/core';
import { CurrencyService } from '@shared/services/currency/currency.service';
import { DebtsService } from './shared/debts.service';
import { UsersService } from '@users/shared/users.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { CommonModule, DecimalPipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DebtTracingComponent } from './debt-tracing/debt-tracing.component';
import { ExchangePipe } from '@shared/pipes/exchange.pipe';
import { Debt } from '@shared/models';

@Component({
  selector: 'app-debts',
  templateUrl: './debts.component.html',
  styleUrls: ['./debts.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    DebtTracingComponent,
    ExchangePipe,
    DecimalPipe
  ],
})
export class DebtsComponent {
  private debtsService = inject(DebtsService);
  private userService = inject(UsersService);
  private currencyService = inject(CurrencyService);

  debts = toSignal(this.debtsService.getDebts(), { initialValue: {} as Record<string, Debt> });
  users = toSignal(this.userService.getIterableUsers(), { initialValue: [] });
  currency = this.currencyService.getCurrencySettings();
  debtTracing = toSignal(this.debtsService.getDebtTracing(), { initialValue: [] });

  getDebt(debts: Record<string, Debt>, userId: string): Debt | undefined {
    return debts[userId];
  }
}
