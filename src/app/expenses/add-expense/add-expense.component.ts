import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MatSnackBar } from '@angular/material/snack-bar';
import { firstValueFrom, Observable } from 'rxjs';
import { CurrencyService } from '../../shared/currency.service';
import { DebtsService } from '../../shared/debts.service';
import { ExpensesService } from '../../shared/expenses.service';
import { CurrencyPlugin, Expense, ExpenseTypes, User } from '../../shared/models';
import { openSnackBar, round2decimals, userToast } from '../../shared/utils';
import { UsersService } from '../../users/shared/users.service';
import { ExpensesForm } from './model';

@Component({
  selector: 'app-add-expense',
  templateUrl: './add-expense.component.html',
  styleUrls: ['./add-expense.component.less']
})
export class AddExpenseComponent implements OnInit {
  expenseForm: FormGroup;
  currency: CurrencyPlugin;
  usersHTML: Observable<Array<User>>;
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
    private _snackBar: MatSnackBar,
    private fb: FormBuilder
    ) {
    this.expenseTypes = this.expensesService.getExpensesTypes();
    this.usersHTML = this.usersService.getIterableUsers();
    this.currency = this.currencyService.getCurrencySettings();

    this.expenseForm = this.fb.group({
      name: ['', Validators.required],
      cost: ['', [Validators.required, Validators.min(1)]],
      title: ['', Validators.required],
      sharedBy: this.fb.array([]),
      type: ['', Validators.required],
      date: [new Date(), Validators.required]
    });


    const sharedBy = this.expenseForm.get('sharedBy') as FormArray
    this.usersHTML.forEach(users => {
      users.forEach(user =>  sharedBy.push(this.fb.control(user.id)))
    }
      );

  }

  ngOnInit(): void {}

  onSubmit(expenseForm: any) {
    const originalCost = parseFloat(expenseForm.cost);
    const costPerPerson = originalCost / expenseForm.sharedBy.length;

    const expense: Expense = {
      "id": '',
      "title": expenseForm.title,
      "originalCost": originalCost,
      "cost": costPerPerson,
      "date": expenseForm.date.toISOString().split('T')[0],
      "paidBy": expenseForm.name,
      "typeId": expenseForm.type,
      "sharedBy": expenseForm.sharedBy,
      "settleBy": []
    }

    this.expensesService.addExpense(expense);
    this.debtsService.updateExpenseDebt(expense);

    this.clearInput();
    openSnackBar(this._snackBar, userToast.OK, this.toastmsg.OK)
  }

  clearInput():void {
  }

  onCheckboxChange(e: any) {
    const interests: FormArray = this.expenseForm.get('sharedBy') as FormArray;
    if(e.checked) {
      interests.push(new FormControl(e.source.value))
    } else {
      const i = interests.controls.findIndex(x => x.value === e.source.value);
      interests.removeAt(i);
    }
  }

  calcExchange(cost: string) :number {
    return this.currencyService.calcExchangeValue(parseFloat(cost));
  }


}
