import { Expense } from './expense.model';

export interface IndividualDebt {
  userName?: string;
  newDebt: number;
  individualtotalIveBeenPaid: number;
  RefDebtsIds: Array<Expense>;
  individualtotalIPaid?: number;
}
