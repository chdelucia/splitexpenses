import { Mapper } from 'src/app/core/mapper';
import { Expense } from '@shared/models';

export class ExpensesMapper implements Mapper<Expense, Expense> {
  mapToList(param: Expense[]): Expense[] {
    return param;
  }

  mapFromList(param: Expense[]): Expense[] {
    return param;
  }

  mapFrom(param: Expense): Expense {
    return param;
  }

  mapTo(param: Expense): Expense {
    return param;
  }
}
