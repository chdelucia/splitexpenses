import { Component, OnInit } from '@angular/core';
import { CurrencyService } from '../shared/currency.service';
import { DebtsService } from '../shared/debts.service';
import { ExpensesService } from '../shared/expenses.service';
import { CurrencyPlugin, Debt, Expense, User } from '../shared/models';
import { UsersService } from '../shared/users.service';
import { WeatherService } from '../shared/weather.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.less']
})
export class MainComponent implements OnInit {
  users: Array<User>
  expenses: Map<string, Expense>
  debts: Map<string, Debt>;
  weatherActive: boolean;
  currency: CurrencyPlugin;

  constructor(
    private expensesService: ExpensesService,
    private usersService: UsersService,
    private debtsService: DebtsService,
    private weatherService: WeatherService,
    private currencyService: CurrencyService
    ) {
    this.users = this.usersService.getIterableUsers();
    this.expenses = this.expensesService.getExpenses();
    this.debts = this.debtsService.getDebts();
    this.weatherActive = this.weatherService.getWeahterSettings().active;
    this.currency = this.currencyService.getCurrencySettings();
  }

  ngOnInit(): void {
  }

  calcExchange(value?: number) {
    return this.currencyService.calcExchangeValue(value || 0);
  }


}
