export interface Expense {
  id: string;
  title: string;
  date: string;
  cost: number;
  originalCost: number;
  paidBy: string;
  typeId: string;
  sharedBy: Array<string>;
  settleBy: Array<string>;
}
