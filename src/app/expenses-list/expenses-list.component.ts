import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { CurrencyService } from '../shared/currency.service';
import { DebtsService } from '../shared/debts.service';
import { ExpensesService } from '../shared/expenses.service';
import { CurrencyPlugin, Expense, User } from '../shared/models';
import { UsersService } from '../shared/users.service';

@Component({
  selector: 'app-expenses-list',
  templateUrl: './expenses-list.component.html',
  styleUrls: ['./expenses-list.component.less']
})
export class ExpensesListComponent implements OnInit, OnChanges {
  @Input() filter: string = '';

  expenses: Map<string, Expense>;
  expensesHTML: Array<Expense> = [];
  currency: CurrencyPlugin;
  users: Map<string, User>;
  totalUsers: number;
  dates: Array<string> = [];

  constructor(
    private expensesService: ExpensesService,
    private debtsService: DebtsService,
    private currencyService: CurrencyService,
    private usersService: UsersService
    ) { 
    this.expenses = this.expensesService.getExpenses();
    this.currency = this.currencyService.getCurrencySettings();
    this.users = this.usersService.getUsers();
    this.totalUsers = this.users.size;
    this.expensesHTML = Array.from(this.expenses.values());
    this.dates = this.expensesService.getExpensesDates();
  }

  ngOnInit(): void {
    if(this.filter){
      this.createArrayofExpenses();
     }

  }
  
  ngOnChanges(){
    if(this.filter){
     this.createArrayofExpenses();
    }
  }

  deleteExpense(key: string) {
    this.expensesService.deleteExpense(key);
    this.expenses = this.expensesService.getExpenses();
    this.createArrayofExpenses();
    this.debtsService.reset();
  }

  createArrayofExpenses(){
    this.expensesHTML = this.expensesService.getExpensesFilterByType(this.filter);
  }

  calcExchange(value?: number) {
    return this.currencyService.calcExchangeValue(value || 0);
  }

}
