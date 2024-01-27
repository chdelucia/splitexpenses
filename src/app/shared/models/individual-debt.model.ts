import { Expense } from './expense.model';

export interface IndividualDebt {
  newDebt: number;
  individualtotalIveBeenPaid: number;
  RefDebtsIds: Array<Expense>;
  individualtotalIPaid?: number;
}
