import { Debt } from '@shared/models';

export interface DebtState {
  debts: Map<string, Debt>;
}
