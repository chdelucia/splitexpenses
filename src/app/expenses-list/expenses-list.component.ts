import { Component, Input, NgIterable, OnChanges, OnInit } from '@angular/core';
import { DebtsService } from '../shared/debts.service';
import { ExpensesService } from '../shared/expenses.service';
import { Expense } from '../shared/models';

@Component({
  selector: 'app-expenses-list',
  templateUrl: './expenses-list.component.html',
  styleUrls: ['./expenses-list.component.less']
})
export class ExpensesListComponent implements OnInit, OnChanges {
  @Input() filter: string = '';

  expenses: Map<string, Expense>;
  expensesHTML: Array<Expense> = []

  constructor(
    private expensesService: ExpensesService,
    private debtsService: DebtsService
    ) { 
    this.expenses = this.expensesService.getExpenses();
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

}
