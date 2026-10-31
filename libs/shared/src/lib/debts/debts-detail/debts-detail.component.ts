import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
import { CurrencyService } from '@shared/services';
import { ExpensesService } from '@expenses/shared/expenses.service';
import { CurrencyPlugin, Expense } from '@shared/models';
import { UsersService } from '@users/shared/users.service';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { WrapFnPipe } from '@shared/pipes/wrap-fn.pipe';

@Component({
  selector: 'app-debts-detail',
  templateUrl: './debts-detail.component.html',
  styleUrls: ['./debts-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule, MatTableModule, WrapFnPipe],
})
export class DebtsDetailComponent {
  private userService = inject(UsersService);
  private currencyService = inject(CurrencyService);
  private expensesService = inject(ExpensesService);

  users = this.userService.getIterableUsers();
  currency: CurrencyPlugin = this.currencyService.getCurrencySettings();
  expenses = this.expensesService.getEnrichedExpenses();

  displayedColumns = computed(() => {
    const userNames = this.users().map((user) => user.name);
    return ['title', 'originalCost', ...userNames];
  });

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