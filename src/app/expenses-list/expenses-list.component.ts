import { Component, Input, NgIterable, OnChanges, OnInit } from '@angular/core';
import { CurrencyService } from '../shared/currency.service';
import { DebtsService } from '../shared/debts.service';
import { ExpensesService } from '../shared/expenses.service';
import { CurrencyPlugin, Expense } from '../shared/models';

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

  constructor(
    private expensesService: ExpensesService,
    private debtsService: DebtsService,
    private currencyService: CurrencyService
    ) { 
    this.expenses = this.expensesService.getExpenses();
    this.currency = this.currencyService.getCurrencySettings();
  }

  ngOnInit(): void {
    this.createArrayofExpenses();
  }
  
  ngOnChanges(){
    this.createArrayofExpenses();
  }

  deleteExpense(key: string) {
    this.expensesService.deleteExpense(key);
    this.expenses = this.expensesService.getExpenses();
    this.createArrayofExpenses();
    this.debtsService.reset();
  }

  createArrayofExpenses(){
    this.expensesHTML = [];
    this.expenses.forEach( item => {
      if(this.filter){
        if(this.filter === item.type){
          this.expensesHTML.push(item);
        } 
      } else{
        this.expensesHTML.push(item);
      }
      
    });
  }

  calcExchange(value?: number) {
    return this.currencyService.calcExchangeValue(value || 0);
  }

}