import { Observable } from 'rxjs';
import { Expense } from '@shared/models';

export abstract class ExpenseRepository {
  abstract getExpensesAPI(): Observable<Expense[]>;
  abstract getExpenseAPI(id: string): Observable<Expense>;
}
