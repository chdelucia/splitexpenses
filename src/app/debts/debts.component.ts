import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { CurrencyService } from '@shared/services/currency.service';
import { DebtsService } from './shared/debts.service';
import { CurrencyPlugin, Debt, TraceAutoSettle, User } from '@shared/models';
import { UsersService } from '@users/shared/users.service';

@Component({
  selector: 'app-debts',
  templateUrl: './debts.component.html',
  styleUrls: ['./debts.component.scss'],
})
export class DebtsComponent {
  debts$: Observable<Map<string, Debt>> = this.debtsService.getDebts();

  users$: Observable<Array<User>> = this.userService.getIterableUsers();

  currency: CurrencyPlugin = this.currencyService.getCurrencySettings();

  debtTracing: TraceAutoSettle[] = this.debtsService.getDebtTracing();

  constructor(
    private debtsService: DebtsService,
    private userService: UsersService,
    private currencyService: CurrencyService,
  ) {}
}
