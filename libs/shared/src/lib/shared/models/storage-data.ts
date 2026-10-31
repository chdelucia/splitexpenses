import { CurrencyPlugin } from './currency.model';
import { Expense } from './expense.model';
import { User } from './user.model';

export interface StorageData {
  users: Record<string, User>;
  expenses: Record<string, Expense>;
  name: string;
  currency: CurrencyPlugin;
}
