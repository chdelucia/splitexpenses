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
    RefDebtsIds: Array<Expense>,
}

export interface Debt {
    totalDebts: number,
    debts: Map<string, IndividualDebt>
}

export interface StorageData {
    users: string
    expenses: string,
    travels?: string
}

export interface Travel {
    names: Array<string>
    active: string
}