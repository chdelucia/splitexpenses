import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { CurrencyService } from '@shared/services';
import { ExpensesService } from '@expenses/shared/expenses.service';
import { CurrencyPlugin, Expense, User } from '@shared/models';
import { UsersService } from '@users/shared/users.service';
import { MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { WrapFnPipe } from '@shared/pipes/wrap-fn.pipe';

@Component({
  selector: 'app-debts-detail',
  templateUrl: './debts-detail.component.html',
  styleUrls: ['./debts-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule, MatTableModule, WrapFnPipe],
})
export class DebtsDetailComponent implements OnInit {
  private userService = inject(UsersService);
  private currencyService = inject(CurrencyService);
  private expensesService = inject(ExpensesService);

  users$!: Array<User>;
  currency: CurrencyPlugin = this.currencyService.getCurrencySettings();
  expenses$!: Expense[];
  displayedColumns: string[] = [];

  ngOnInit(): void {
    this.initColumns();
    this.initExpenses();
  }

  initExpenses(): void {
    this.expensesService.getIterableExpenses().subscribe((expenses) => {
      this.expenses$ = expenses;
    });
  }

  initColumns(): void {
    this.userService.getIterableUsers().subscribe((users) => {
      this.users$ = users;
      const userNames = users.map((user) => user.name);
      this.displayedColumns = ['title', 'originalCost', ...userNames];
    });
  }

  calcUserTotalBalance(userId: string, expenses: Expense[]): number {
    let total = 0;
    expenses.forEach((expense) => {
      const paidByme = userId === expense.paidBy;
      const Iparticipated = expense.sharedBy.includes(userId);
      if (paidByme) {
        total += expense.originalCost;
      }
      if (Iparticipated) {
        total -= expense.cost;
      }
    });

    return total;
  }

  calculateExpenseBalance(expense: Expense, userId: string): number {
    let total = -expense.cost;
    const paidByme = userId === expense.paidBy;
    const Iparticipated = expense.sharedBy.includes(userId);
    if (paidByme) {
      total += expense.originalCost;
      if (!Iparticipated) {
        total += expense.cost;
      }
    }
    return total;
  }
}
