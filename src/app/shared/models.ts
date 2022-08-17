export interface User {
    id: number;
    name: string;
}

export interface Expense {
    title: string;
    date: string;
    cost: number;
    paidBy: string;
    id: number;
}

export interface IndividualDebt {
    newDebt?: number;
    individualTotalDebts: number,
    RefDebtsIds: Array<number>,
}

export interface Debt {
    totalDebts: number,
    debts: Map<string, IndividualDebt>
}