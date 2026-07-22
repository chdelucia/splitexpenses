import {
  Component,
  inject,
  input,
  OnInit,
  numberAttribute,
  effect,
  computed,
  resource,
  signal,
} from '@angular/core';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { first, firstValueFrom, Observable } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { CurrencyService } from '@shared/services/currency/currency.service';
import { ExpensesService } from '@expenses/shared/expenses.service';
import { CurrencyPlugin, Expense, ExpenseTypes, User } from '@shared/models';
import { globalToast, openSnackBar, getCategoryIcon } from '@shared/utils';
import { UsersService } from '@users/shared/users.service';
import {
  MatCheckboxChange,
  MatCheckboxModule,
} from '@angular/material/checkbox';
import { form, FormField, required, validate } from '@angular/forms/signals';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatRadioModule } from '@angular/material/radio';

export interface ExpenseFormModel {
  title: string;
  date: Date;
  name: string;
  cost: number | '';
  type: string | '';
  sharedBy: Record<string, boolean>;
}

@Component({
  selector: 'app-add-expense',
  templateUrl: './add-expense.component.html',
  styleUrls: ['./add-expense.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormField,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatCheckboxModule,
    MatButtonModule,
    MatIconModule,
    MatRadioModule,
  ],
  providers: [provideNativeDateAdapter()],
})
export class AddExpenseComponent {
  id = input<string | number, number>('', { transform: numberAttribute });
  individualMode = input<boolean>(false);

  isIndividualMode = computed(
    () => this.individualMode() || this.route.snapshot?.data?.['individualMode'],
  );

  expenseResource = resource({
    loader: async () => {
      const id = this.id();
      if (!id) return undefined;
      return firstValueFrom(
        this.expensesService.getExpenseByID(id.toString()),
      );
    },
  });

  public route = inject(ActivatedRoute);
  private router = inject(Router);
  private expensesService = inject(ExpensesService);
  private usersService = inject(UsersService);
  private currencyService = inject(CurrencyService);
  private _snackBar = inject(MatSnackBar);

  currency = this.currencyService.currencySignal;

  expenseModel = signal<ExpenseFormModel>({
    title: '',
    date: new Date(),
    name: '',
    cost: '',
    type: '',
    sharedBy: {},
  });

  expenseForm = form(this.expenseModel, (path) => {
    required(path.title);
    required(path.date);
    required(path.type);
    required(path.cost);
    validate(path.name, (ctx) => {
      if (!this.isIndividualMode() && !ctx.value()) {
        return { kind: 'required', message: 'Name is required' };
      }
      return null;
    });
  });

  users = this.usersService.iterableUsers;
  expenseTypes: ExpenseTypes[] = this.expensesService.getExpensesTypes();
  expense?: Expense;

  getCategoryIcon(typeId: string | number): string {
    return getCategoryIcon(Number(typeId));
  }

  get isEditing(): boolean {
    return !!this.expense;
  }

  private toastmsg = {
    OK: $localize`Gasto guardado correctamente`,
    KO: $localize`Error fatal`,
  };

  constructor() {
    effect(() => {
      this.handleIndividualMode();
      this.initializeCheckboxControls();
    });

    effect(() => {
      const expense = this.expenseResource.value();
      if (expense) {
        this.expense = expense as Expense;
        this.updateForm();
      }
    });
  }

  private handleIndividualMode(): void {
    if (this.isIndividualMode() && this.users().length > 0) {
      this.expenseModel.update(m => ({
        ...m,
        name: this.users()[0].id
      }));
    }
  }

  private initializeCheckboxControls(): void {
    const currentShared = this.expenseModel().sharedBy;
    const users = this.users();
    if (users.length === 0) return;

    const newShared: Record<string, boolean> = { ...currentShared };
    let changed = false;
    users.forEach((user) => {
      if (newShared[user.id] === undefined) {
        let isChecked = true;
        if (this.isEditing && !this.expense?.sharedBy.includes(user.id)) {
          isChecked = false;
        }
        newShared[user.id] = isChecked;
        changed = true;
      }
    });

    if (changed) {
      this.expenseModel.update(m => ({
        ...m,
        sharedBy: newShared
      }));
    }
  }

  onSubmit() {
    if (this.expenseForm().invalid()) return;

    const isIndividual = this.isIndividualMode();
    const expenseData = this.expenseModel();

    const selectedUserIds = isIndividual
      ? [this.users()[0].id]
      : this.users()
          .filter((user) => expenseData.sharedBy[user.id])
          .map((user) => user.id);

    const originalCost = Number(expenseData.cost);
    const costPerPerson = originalCost / selectedUserIds.length;

    const dateVal = expenseData.date;
    const dateStr = dateVal instanceof Date ? dateVal.toDateString() : new Date(dateVal).toDateString();

    const expense: Expense = {
      id: this.isEditing ? this.expense!.id : '',
      title: expenseData.title,
      originalCost: originalCost,
      cost: costPerPerson,
      date: dateStr,
      paidBy: isIndividual ? this.users()[0].id : expenseData.name,
      typeId: expenseData.type,
      sharedBy: selectedUserIds,
      settleBy: [],
    };

    this.addExpense(expense);
    openSnackBar(this._snackBar, globalToast.OK, this.toastmsg.OK);
    this.resetForm();

    const redirectPath = isIndividual
      ? '/personal/details'
      : '/expense/details';
    this.router.navigate([redirectPath]);
  }

  updateForm() {
    if (!this.expense) return;
    const sharedByObj: Record<string, boolean> = {};
    this.users().forEach((u) => {
      sharedByObj[u.id] = this.expense!.sharedBy.includes(u.id);
    });

    this.expenseModel.set({
      title: this.expense.title,
      date: this.expense.date ? new Date(this.expense.date) : new Date(),
      name: this.expense.paidBy,
      cost: this.expense.originalCost,
      type: this.expense.typeId,
      sharedBy: sharedByObj,
    });
  }

  private addExpense(expense: Expense): void {
    if (this.isEditing) {
      this.expensesService.editExpense(expense);
    } else {
      this.expensesService.addExpense(expense);
    }
  }

  private resetForm(): void {
    this.expenseForm().reset({
      title: '',
      date: new Date(),
      name: '',
      cost: '',
      type: '',
      sharedBy: {},
    });
  }
}
