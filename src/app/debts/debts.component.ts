import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { CurrencyService } from '../shared/currency.service';
import { DebtsService } from '../shared/debts.service';
import { CurrencyPlugin, Debt, User } from '../shared/models';
import { UsersService } from '../shared/users.service';

@Component({
  selector: 'app-debts',
  templateUrl: './debts.component.html',
  styleUrls: ['./debts.component.less']
})
export class DebtsComponent implements OnInit {

  debts: Map<string, Debt>;
  usersHTML: Observable<Array<User>>;
  currency: CurrencyPlugin;

  constructor(
    private debtsService: DebtsService,
    private userService: UsersService,
    private currencyService: CurrencyService
  ) {
    this.usersHTML = this.userService.getIterableUsers();
    this.debts = this.debtsService.getDebts();
    this.currency = this.currencyService.getCurrencySettings();
  }

  ngOnInit(): void {
  }

  calcExchange(value?: number) {
    return this.currencyService.calcExchangeValue(value || 0);
  }

}
