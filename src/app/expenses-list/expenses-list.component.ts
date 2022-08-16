import { Component, OnInit } from '@angular/core';
import { ExpensesService } from '../expenses.service';
import { Expense } from '../models';

@Component({
  selector: 'app-expenses-list',
  templateUrl: './expenses-list.component.html',
  styleUrls: ['./expenses-list.component.less']
})
export class ExpensesListComponent implements OnInit {
  expenses: Map<string, Expense> = new Map()
  expensesHTML: any;

  constructor(private expensesService: ExpensesService) { 
    this.expenses = this.expensesService.getExpenses();
  }

  ngOnInit(): void {
    this.expensesHTML = this.expenses.values();
  }

}
