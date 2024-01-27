import { IndividualDebt } from './individual-debt.model';

export interface Debt {
  totalIveBeenPaid: number;
  totalIPaid: number;
  totalIowe: number;
  debts: Map<string, IndividualDebt>;
}
