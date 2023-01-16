import { Component, OnInit } from '@angular/core';
import { CurrencyService } from '../shared/currency.service';
import { DebtsService } from '../shared/debts.service';
import { ExpensesService } from '../shared/expenses.service';
import { CurrencyPlugin, Debt, User } from '../shared/models';
import { UsersService } from '../shared/users.service';

@Component({
  selector: 'app-debts',
  templateUrl: './debts.component.html',
  styleUrls: ['./debts.component.less']
})
export class DebtsComponent implements OnInit {

  debts: Map<string, Debt>;
  users: Map<string, User>;
  usersHTML: Array<User>;
  currency: CurrencyPlugin;

  constructor(
    private debtsService: DebtsService,
    private userService: UsersService,
    private currencyService: CurrencyService
  ) { 
    this.users = this.userService.getUsers();
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
