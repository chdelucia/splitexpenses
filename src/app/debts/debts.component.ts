import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { CurrencyService } from '@shared/currency.service';
import { DebtsService } from './shared/debts.service';
import { CurrencyPlugin, Debt, TraceAutoSettle, User } from '@shared/models';
import { UsersService } from '@users/shared/users.service';
import { LoggerService } from '@core/services/logger.service';

@Component({
  selector: 'app-debts',
  templateUrl: './debts.component.html',
  styleUrls: ['./debts.component.scss'],
})
export class DebtsComponent implements OnInit, OnDestroy {
  debts: Map<string, Debt> = this.debtsService.getDebts();

  users$: Observable<Array<User>> = this.userService.getIterableUsers();

  currency: CurrencyPlugin = this.currencyService.getCurrencySettings();

  debtTracing: TraceAutoSettle[] = [];

  private debtsSubscription: Subscription | undefined;

  constructor(
    private debtsService: DebtsService,
    private userService: UsersService,
    private currencyService: CurrencyService,
    private loggerService: LoggerService,
  ) {}

  ngOnInit(): void {
    this.debtsService.initialize();
    this.debtsSubscription = this.debtsService.debtList$.subscribe(
      (newValue) => {
        this.debts = newValue;
        this.loggerService.info('DebtsComponent', 'ngInit', newValue, 'red');
        this.debtTracing = this.debtsService.getDebtTracing();
      },
    );
  }

  ngOnDestroy(): void {
    this.debtsSubscription?.unsubscribe();
  }
}
