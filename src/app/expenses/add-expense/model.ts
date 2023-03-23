export interface ExpensesForm {
    name: string,
    title: string,
    cost: string,
    type: string,
    date: Date
    sharedBy: Array<string>
}
