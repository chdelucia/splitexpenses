import { Component, OnInit } from '@angular/core';
import { ExpensesService } from '../shared/expenses.service';
import { Expense } from '../shared/models';

@Component({
  selector: 'app-expenses-list',
  templateUrl: './expenses-list.component.html',
  styleUrls: ['./expenses-list.component.less']
})
export class ExpensesListComponent implements OnInit {
  expenses: Map<number, Expense> = new Map()
  expensesHTML: any;

  constructor(private expensesService: ExpensesService) { 
    this.expenses = this.expensesService.getExpenses();
  }

  ngOnInit(): void {
    this.expensesHTML = this.expenses.values();
  }

  deleteExpense(key: number) {
    this.expensesService.deleteExpense(key);
    this.expenses = this.expensesService.getExpenses();
    this.expensesHTML = this.expenses.values();
  }

}
