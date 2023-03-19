import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MatSnackBar } from '@angular/material/snack-bar';
import { firstValueFrom, Observable } from 'rxjs';
import { CurrencyService } from '../shared/currency.service';
import { DebtsService } from '../shared/debts.service';
import { ExpensesService } from '../shared/expenses.service';
import { CurrencyPlugin, Expense, ExpenseTypes, User } from '../shared/models';
import { openSnackBar, round2decimals, userToast } from '../shared/utils';
import { UsersService } from '../users/shared/users.service';

import { ExpensesForm } from './model'

@Component({
  selector: 'app-add-expense',
  templateUrl: './add-expense.component.html',
  styleUrls: ['./add-expense.component.less']
})
export class AddExpenseComponent implements OnInit {
  currency: CurrencyPlugin;
  usersHTML: Observable<Array<User>>;

  model: ExpensesForm;
  expenseTypes: ExpenseTypes[];

  private toastmsg =  {
    OK : $localize`Gasto guardado correctamente`,
    KO : $localize`Error fatal`,
  }

  constructor(
    private expensesService: ExpensesService,
    private usersService: UsersService,
    private debtsService: DebtsService,
    private currencyService: CurrencyService,
    private _snackBar: MatSnackBar
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

  ngOnInit(): void {}

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
    openSnackBar(this._snackBar, userToast.OK, this.toastmsg.OK)
  }

  clearInput():void {
    this.model.cost = '';
    this.model.title = '';
  }

  calcExchange() :number {
    return this.currencyService.calcExchangeValue(parseFloat(this.model.cost));
  }


}
