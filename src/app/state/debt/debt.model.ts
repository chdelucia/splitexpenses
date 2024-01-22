import { Debt } from '@shared/models/models';

export interface DebtState {
  debts: Map<string, Debt>;
}
