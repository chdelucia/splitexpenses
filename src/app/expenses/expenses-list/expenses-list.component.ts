import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { firstValueFrom, Observable } from 'rxjs';
import { CurrencyService } from '../../shared/currency.service';
import { DebtsService } from '../../shared/debts.service';
import { ExpensesService } from '../../shared/expenses.service';
import { CurrencyPlugin, Expense, User } from '../../shared/models';
import { UsersService } from '../../users/shared/users.service';

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
  users: Map<string, User> = new Map();
  totalUsers: number = 0;
  dates: Array<string> = [];

  constructor(
    private expensesService: ExpensesService,
    private debtsService: DebtsService,
    private currencyService: CurrencyService,
    private usersService: UsersService
    ) {
    this.expenses = this.expensesService.getExpenses();
    this.currency = this.currencyService.getCurrencySettings();
    this.expensesHTML = Array.from(this.expenses.values());
    this.dates = this.expensesService.getExpensesDates();
  }

  ngOnInit(): void {
    if(this.filter){
      this.createArrayofExpenses();
    }
    this.usersService.getUsers().subscribe(
      (users: Map<string, User>) => {
        this.users = users;
        this.totalUsers = users.size;
      }
    );
  }

  ngOnChanges(){
    if(this.filter){
     this.createArrayofExpenses();
    }
  }

  deleteExpense(key: string) {
    this.expensesService.deleteExpense(key);
    this.expenses = this.expensesService.getExpenses();
    this.dates = this.expensesService.getExpensesDates();
    this.createArrayofExpenses();
    this.debtsService.reset();
  }

  editExpense(key: string) {

  }

  createArrayofExpenses(){
    if(this.filter){
      this.expensesHTML = this.expensesService.getExpensesFilterByType(this.filter);
    } else {
      this.expensesHTML = Array.from(this.expenses.values());
    }
  }

  calcExchange(value?: number) {
    return this.currencyService.calcExchangeValue(value || 0);
  }

}
