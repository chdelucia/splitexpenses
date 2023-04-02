import { Component, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { CurrencyService } from '../shared/currency.service';
import { DebtsService } from './shared/debts.service';
import { CurrencyPlugin, Debt, TraceAutoSettle, User } from '../shared/models';
import { UsersService } from '../users/shared/users.service';

@Component({
  selector: 'app-debts',
  templateUrl: './debts.component.html',
  styleUrls: ['./debts.component.scss']
})
export class DebtsComponent implements OnInit {

  debts: Map<string, Debt>;
  users$: Observable<Array<User>>;
  currency: CurrencyPlugin;
  traceDebts: TraceAutoSettle[] = []
  private DebtsSubscription: Subscription | undefined;

  constructor(
    private debtsService: DebtsService,
    private userService: UsersService,
    private currencyService: CurrencyService
  ) {
    this.users$ = this.userService.getIterableUsers();
    this.currency = this.currencyService.getCurrencySettings();
    this.debts = this.debtsService.getDebts();
  }

  ngOnInit(): void {
    this.DebtsSubscription = this.debtsService.debtList$.subscribe(newValue => {
      this.debts = newValue;
      this.traceDebts = this.debtsService.getTraceDebts();
    });
  }

  calcExchange(value?: number) {
    return this.currencyService.calcExchangeValue(value || 0);
  }

  ngOnDestroy(): void {
    this.DebtsSubscription?.unsubscribe();
  }

}
