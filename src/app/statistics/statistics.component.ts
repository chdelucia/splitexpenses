import { Component, OnInit } from '@angular/core';
import { CurrencyService } from '../shared/currency.service';
import { ExpensesService } from '../shared/expenses.service';
import { CurrencyPlugin, User } from '../shared/models';
import { UsersService } from '../shared/users.service';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.less']
})
export class StatisticsComponent implements OnInit {
  usersHTML: Array<User>;

  meanCost: number = 0;
  todayCost: number = 0;
  currency: CurrencyPlugin;
  dailyData;
  typeData;

  constructor(
    private expensesService: ExpensesService,
    private currencyService: CurrencyService,
    private userService: UsersService,
    ) {
    this.usersHTML = this.userService.getIterableUsers();
    this.currency = this.currencyService.getCurrencySettings();

    this.todayCost = this.expensesService.getTotalCost();
    this.meanCost = this.expensesService.getAverageCostPerDay();
    this.dailyData = this.expensesService.gettotalCostEachDayPerType();
    this.typeData =  this.expensesService.getExpensesByType();
   }

  ngOnInit(): void {}

  change(id: string): void {
    if(id !== '0'){
      this.init(id)
    } else {
      this.init();
    }
  }

  init(userId? : string) {
    this.todayCost = this.expensesService.getTotalCost(userId);
    this.meanCost = this.expensesService.getAverageCostPerDay(userId);
    this.dailyData = this.expensesService.gettotalCostEachDayPerType(userId);
    this.typeData =  this.expensesService.getExpensesByType(userId);
  }



}
