import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { DebtsService } from '../shared/debts.service';
import { ExpensesService } from '../shared/expenses.service';
import { Debt, Expense } from '../shared/models';
import { UsersService } from '../shared/users.service';

import { ExpensesForm } from './model'

@Component({
  selector: 'app-add-expense',
  templateUrl: './add-expense.component.html',
  styleUrls: ['./add-expense.component.less']
})
export class AddExpenseComponent implements OnInit {
  users: Array<string>

  showAlert = false;
  isError = false;
  
  model: ExpensesForm;
  ExpenseTypes = environment.expensesTypes;

  constructor(
    private expensesService: ExpensesService,
    private usersService: UsersService,
    private debtsService: DebtsService
    ) {
    this.users = this.usersService.getUsers();
    this.model = new ExpensesForm(this.users[0], '', 0, this.ExpenseTypes[this.ExpenseTypes.length - 1]);
  }

  ngOnInit(): void {
  }

  onSubmit(expenseForm: ExpensesForm) {
    let costb = expenseForm.cost / this.users.length;
    const obj: Expense = {
      "id": '',
      "title": expenseForm.title,
      "originalCost": ++expenseForm.cost,
      "cost": costb,
      "date": new Date().toLocaleDateString('ES', { weekday: 'short', day: 'numeric' }),
      "paidBy": expenseForm.name,
      "type": expenseForm.type
    }

    this.expensesService.addExpense(obj);
    this.debtsService.updateExpenseDebt(obj);

    this.clearInput();
    this.showAlert = true;
  }

  clearInput():void {
    this.model.cost = 0;
    this.model.title = '';
  }

  close(){
    this.showAlert = false;
  }

  loadData(data: string) {
    let users = ['Vane', 'Jess']
    localStorage.setItem(environment.localStorageExpenses, data);
    localStorage.setItem(environment.localStorageUsers, JSON.stringify(users))
  }


}
