import { IndividualDebt } from './individual-debt.model';

export interface Debt {
  userName?: string;
  totalIveBeenPaid: number;
  totalIPaid: number;
  totalIowe: number;
  debts: Record<string, IndividualDebt>;
}
