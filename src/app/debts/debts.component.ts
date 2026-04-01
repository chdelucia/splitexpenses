import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { CurrencyService } from '@shared/services/currency/currency.service';
import { DebtsService } from './shared/debts.service';
import { CurrencyPlugin, Debt, TraceAutoSettle, User } from '@shared/models';
import { UsersService } from '@users/shared/users.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ExchangePipe } from '@shared/pipes/exchange.pipe';
import { DebtTracingComponent } from './debt-tracing/debt-tracing.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-debts',
  templateUrl: './debts.component.html',
  styleUrls: ['./debts.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ExchangePipe,
    DebtTracingComponent,
    MatIconModule,
    MatButtonModule,
  ],
})
export class DebtsComponent {
  private debtsService = inject(DebtsService);
  private userService = inject(UsersService);
  private currencyService = inject(CurrencyService);

  debts = toSignal(this.debtsService.getEnrichedDebts());

  users = toSignal(this.userService.getIterableUsers());

  currency: CurrencyPlugin = this.currencyService.getCurrencySettings();

  debtTracing: TraceAutoSettle[] = this.debtsService.getDebtTracing();
}
