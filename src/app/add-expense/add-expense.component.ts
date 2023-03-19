import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { firstValueFrom, Observable } from 'rxjs';
import { CurrencyService } from '../shared/currency.service';
import { DebtsService } from '../shared/debts.service';
import { ExpensesService } from '../shared/expenses.service';
import { CurrencyPlugin, Expense, ExpenseTypes, User } from '../shared/models';
import { round2decimals } from '../shared/utils';
import { UsersService } from '../users/shared/users.service';

import { ExpensesForm } from './model'

@Component({
  selector: 'app-add-expense',
  templateUrl: './add-expense.component.html',
  styleUrls: ['./add-expense.component.less']
})
export class AddExpenseComponent implements OnInit {
  usuarios: string[] = ['usuario1', 'usuario2', 'usuario3'];
  tiposGasto = ['Tipo 1', 'Tipo 2', 'Tipo 3'];
  currency: CurrencyPlugin;
  usersHTML: Observable<Array<User>>;

  showAlert = false;
  isError = false;

  model: ExpensesForm;
  expenseTypes: ExpenseTypes[];

  constructor(
    private expensesService: ExpensesService,
    private usersService: UsersService,
    private debtsService: DebtsService,
    private currencyService: CurrencyService,
    private fb: FormBuilder
    ) {
    this.expenseTypes = this.expensesService.getExpensesTypes();
    this.usersHTML = this.usersService.getIterableUsers();

    this.model = new ExpensesForm(
      '1',
      '',
      '',
      this.expenseTypes[this.expenseTypes.length - 1].id,
      []
      );
    this.usersHTML.subscribe(users => {
    this.model = new ExpensesForm(
      users[0] ? users[0].id : '1',
      '',
      '',
      this.expenseTypes[this.expenseTypes.length - 1].id,
      Array(users.length).fill(true)
      );
    });
    this.currency = this.currencyService.getCurrencySettings();

  }

  ngOnInit(): void {

  }

  async onSubmit(expenseForm: ExpensesForm) {
    let sharedBy: Array<string> = [];
    const users = await firstValueFrom(this.usersHTML)
    this.model.sharedBy.forEach( (value, i) => {
      if(value) { sharedBy.push(users[i].id) };
    })

    let costb = parseFloat(expenseForm.cost) / sharedBy.length;

    const obj: Expense = {
      "id": '',
      "title": expenseForm.title,
      "originalCost": parseFloat(expenseForm.cost),
      "cost": round2decimals(costb),
      "date": new Date().toISOString().split('T')[0],
      "paidBy": expenseForm.name,
      "typeId": expenseForm.type,
      "sharedBy": sharedBy,
      "settleBy": []
    }

    this.expensesService.addExpense(obj);
    this.debtsService.updateExpenseDebt(obj);

    this.clearInput();
    this.showAlert = true;
  }

  clearInput():void {
    this.model.cost = '';
    this.model.title = '';
  }

  calcExchange() :number {
    return this.currencyService.calcExchangeValue(parseFloat(this.model.cost));
  }

  close(): void{
    this.showAlert = false;
  }


}
