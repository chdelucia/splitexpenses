import {
  Component,
  inject,
  Input,
  OnInit,
  numberAttribute,
} from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
  Validators,
  FormGroupDirective,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { take } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { CurrencyService } from '@shared/services/currency/currency.service';
import { ExpensesService } from '@expenses/shared/expenses.service';
import { Expense, ExpenseTypes } from '@shared/models';
import { globalToast, openSnackBar } from '@shared/utils';
import { UsersService } from '@users/shared/users.service';
import {
  MatCheckboxChange,
  MatCheckboxModule,
} from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { ExpenseForm } from '@expenses/models';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ExchangePipe } from '@shared/pipes/exchange.pipe';

@Component({
  selector: 'app-add-expense',
  templateUrl: './add-expense.component.html',
  styleUrls: ['./add-expense.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatCheckboxModule,
    MatRadioModule,
    MatButtonModule,
    MatIconModule,
    ExchangePipe
  ],
})
export class AddExpenseComponent implements OnInit {
  @Input({ transform: numberAttribute }) id = '';

  private route = inject(ActivatedRoute);
  private expensesService = inject(ExpensesService);
  private usersService = inject(UsersService);
  private currencyService = inject(CurrencyService);
  private _snackBar = inject(MatSnackBar);
  private fb = inject(FormBuilder);

  expenseForm: FormGroup;
  currency = this.currencyService.getCurrencySettings();
  users = toSignal(this.usersService.getIterableUsers(), { initialValue: [] });
  expenseTypes: ExpenseTypes[];
  expense?: Expense;

  get isEditing(): boolean {
    return !!this.expense;
  }

  private toastmsg = {
    OK: $localize`Gasto guardado correctamente`,
    KO: $localize`Error fatal`,
  };

  constructor() {
    this.expenseTypes = this.expensesService.getExpensesTypes();

    this.expenseForm = this.fb.group({
      name: ['', Validators.required],
      cost: ['', [Validators.required, Validators.min(1)]],
      title: ['', Validators.required],
      sharedBy: this.fb.array([]),
      type: ['', Validators.required],
      date: [new Date(), Validators.required],
    });
  }

  ngOnInit(): void {
    this.initializeExpense();
    this.initializeCheckboxControls();
  }

  private initializeExpense(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.expensesService
        .getExpenseByID(id)
        .pipe(take(1))
        .subscribe((expense) => {
          this.expense = expense;
          this.updateForm();
        });
    }
  }

  private initializeCheckboxControls(): void {
    const sharedBy = this.expenseForm.get('sharedBy') as FormArray;
    // We wait for users to be available
    this.usersService.getIterableUsers().pipe(take(1)).subscribe(users => {
        users.forEach((user) => {
            const control = this.createFormControl(user.id);
            sharedBy.push(control);
        });
    });
  }

  private createFormControl(userId: string): AbstractControl {
    let controlValue = userId;
    if (this.isEditing && !this.expense?.sharedBy.includes(userId)) {
      controlValue = '';
    }
    return this.fb.control(controlValue);
  }

  onSubmit(expenseForm: ExpenseForm, formDirective: FormGroupDirective) {
    const sharedBy = expenseForm.sharedBy.filter((id) => !!id);
    if (sharedBy.length === 0) {
      openSnackBar(
        this._snackBar,
        globalToast.KO,
        $localize`Debes seleccionar al menos un usuario`
      );
      return;
    }
    const originalCost = expenseForm.cost;
    const costPerPerson = originalCost / sharedBy.length;

    const expense: Expense = {
      id: this.isEditing ? this.expense!.id : '',
      title: expenseForm.title,
      originalCost: originalCost,
      cost: costPerPerson,
      date: expenseForm.date.toDateString(),
      paidBy: expenseForm.name,
      typeId: expenseForm.type,
      sharedBy: sharedBy,
      settleBy: [],
    };

    this.addExpense(expense);
    openSnackBar(this._snackBar, globalToast.OK, this.toastmsg.OK);
    this.resetForm();
    formDirective.resetForm();
  }

  updateForm() {
    this.expenseForm.patchValue({
      name: this.expense?.paidBy,
      cost: this.expense?.originalCost,
      title: this.expense?.title,
      date: this.expense?.date ? new Date(this.expense?.date) : new Date(),
      type: this.expense?.typeId,
    });

    // Update sharedBy FormArray if editing
    if (this.isEditing && this.expense) {
        const sharedByArray = this.expenseForm.get('sharedBy') as FormArray;
        sharedByArray.clear();
        this.users().forEach(user => {
            const isShared = this.expense?.sharedBy.includes(user.id);
            sharedByArray.push(this.fb.control(isShared ? user.id : ''));
        });
    }
  }

  onCheckboxChange(e: MatCheckboxChange) {
    const interests: FormArray = this.expenseForm.get('sharedBy') as FormArray;
    const usersList = this.users();
    const index = usersList.findIndex(u => u.id === e.source.value);

    if (index !== -1) {
        if (e.checked) {
            interests.at(index).setValue(e.source.value);
        } else {
            interests.at(index).setValue('');
        }
    }
  }

  private addExpense(expense: Expense): void {
    if (this.isEditing) {
      this.expensesService.editExpense(expense);
    } else {
      this.expensesService.addExpense(expense);
    }
  }

  private resetForm(): void {
    if (!this.isEditing) {
        this.expenseForm.reset({
            date: new Date(),
            sharedBy: this.users().map(u => u.id)
        });
    }
  }
}
