import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { CurrencyService } from '@shared/services';
import { ExpensesService } from '@expenses/shared/expenses.service';
import { CurrencyPlugin, Expense, User } from '@shared/models';
import { UsersService } from '@users/shared/users.service';

@Component({
  selector: 'app-debts-detail',
  templateUrl: './debts-detail.component.html',
  styleUrls: ['./debts-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DebtsDetailComponent implements OnInit {
  users$!: Array<User>;
  currency: CurrencyPlugin = this.currencyService.getCurrencySettings();
  expenses$!: Expense[];
  displayedColumns: string[] = [];

  constructor(
    private userService: UsersService,
    private currencyService: CurrencyService,
    private expensesService: ExpensesService,
  ) {}

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
