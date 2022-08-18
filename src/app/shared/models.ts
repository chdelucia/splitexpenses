export interface User {
    id: number;
    name: string;
}

export interface Expense {
    title: string;
    date: string;
    cost: number;
    originalCost: number;
    paidBy: string;
    id: string;
    type: string;
}

export interface IndividualDebt {
    newDebt?: number;
    individualTotalDebts: number,
    RefDebtsIds: Array<string>,
}

export interface Debt {
    totalDebts: number,
    debts: Map<string, IndividualDebt>
}