import { Debt } from '@shared/models';

export interface DebtState {
  debts: Record<string, Debt>;
}
