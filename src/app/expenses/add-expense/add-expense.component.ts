import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import {  Observable } from 'rxjs';
import { CurrencyService } from '../../shared/currency.service';
import { DebtsService } from '../../shared/debts.service';
import { ExpensesService } from '../../shared/expenses.service';
import { CurrencyPlugin, Expense, ExpenseTypes, User } from '../../shared/models';
import { globalToast, openSnackBar} from '../../shared/utils';
import { UsersService } from '../../users/shared/users.service';

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
  expense?: Expense;

  get isEditing(): boolean {
    return !!this.expense;
  }

  private toastmsg =  {
    OK : $localize`Gasto guardado correctamente`,
    KO : $localize`Error fatal`,
  }

  constructor(
    private route: ActivatedRoute,
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
  }

  ngOnInit(): void {
    this.initializeExpense();
    this.initializeCheckboxControls();
  }

  private initializeExpense(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.expense = this.expensesService.getExpenseByID(id);
      this.updateForm();
    }
  }

  private initializeCheckboxControls(): void {
    const sharedBy = this.expenseForm.get('sharedBy') as FormArray;
    this.usersHTML.forEach(users => {
      users.forEach(user => {
        const control = this.createFormControl(user.id);
        sharedBy.push(control);
      });
    });
  }

  private createFormControl(userId: string): AbstractControl {
    let controlValue = userId;
    if(this.isEditing && !this.expense?.sharedBy.includes(userId)) {
      controlValue = '';
    }
    return this.fb.control(controlValue);
  }

  onSubmit(expenseForm: any) {
    const sharedBy = expenseForm.sharedBy.join('').split('');
    const originalCost = parseFloat(expenseForm.cost);
    const costPerPerson = originalCost / sharedBy.length;

    /** Necessary cause date format from edit page is not in isoFormat
     * Why you do that?
     * idk even why, some cloudy day I thought it was a brillant idea, now is a legacy code
     * TODO  - all dates should be storage as ms
    */
    if (this.isEditing) expenseForm.date = new Date(expenseForm.date);

    const expense: Expense = {
      "id": this.isEditing ? this.expense!.id : '',
      "title": expenseForm.title,
      "originalCost": originalCost,
      "cost": costPerPerson,
      "date": expenseForm.date.toISOString().split('T')[0],
      "paidBy": expenseForm.name,
      "typeId": expenseForm.type,
      "sharedBy": sharedBy,
      "settleBy": []
    }

    this.addExpense(expense);
    this.updateDebts(expense)
    openSnackBar(this._snackBar, globalToast.OK, this.toastmsg.OK);
    this.resetForm();
  }


  updateForm() {
    this.expenseForm.patchValue({
      name: this.expense?.paidBy,
      cost: this.expense?.originalCost,
      title: this.expense?.title,
      date: this.expense?.date,
      type: this.expense?.typeId
    });
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

  private updateDebts(expense: Expense): void {
    if(this.isEditing) {
      this.debtsService.reset();
    } else {
      this.debtsService.updateExpenseDebt(expense);
    }
  }

  private addExpense(expense: Expense): void {
    if(this.isEditing) {
      this.expensesService.editExpense(expense)
    } else {
      this.expensesService.addExpense(expense);
    }
  }

  private resetForm(): void {
    if(!this.isEditing) this.expenseForm.reset();
  }





}
