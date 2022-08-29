import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { CurrencyService } from '../shared/currency.service';
import { DebtsService } from '../shared/debts.service';
import { ExpensesService } from '../shared/expenses.service';
import { CurrencyPlugin, Debt, Expense, User } from '../shared/models';
import { UsersService } from '../shared/users.service';
import { round2decimals } from '../shared/utils';

import { ExpensesForm } from './model'

@Component({
  selector: 'app-add-expense',
  templateUrl: './add-expense.component.html',
  styleUrls: ['./add-expense.component.less']
})
export class AddExpenseComponent implements OnInit {

  currency: CurrencyPlugin;
  usersHTML: Array<User>
  private users: Map<string, User>

  showAlert = false;
  isError = false;
  
  model: ExpensesForm;
  ExpenseTypes = environment.expensesTypes;

  constructor(
    private expensesService: ExpensesService,
    private usersService: UsersService,
    private debtsService: DebtsService,
    private currencyService: CurrencyService
    ) {
    this.users = this.usersService.getUsers();
    this.usersHTML = this.usersService.getIterableUsers()
    this.model = new ExpensesForm('1', '', '', this.ExpenseTypes[this.ExpenseTypes.length - 1], [true,true,true]);
    this.currency = this.currencyService.getCurrencySettings();
  }

  ngOnInit(): void {
  }

  onSubmit(expenseForm: ExpensesForm) {
    let sharedBy: Array<string> = [];
    this.model.sharedBy.forEach( (value, i) => {
      if(value) { sharedBy.push(this.usersHTML[i].id) };
    })

    let costb = parseFloat(expenseForm.cost) / sharedBy.length;
    const obj: Expense = {
      "id": '',
      "title": expenseForm.title,
      "originalCost": parseFloat(expenseForm.cost),
      "cost": round2decimals(costb),
      "date": new Date().toLocaleDateString('ES', { weekday: 'short', day: 'numeric' }),
      "paidBy": expenseForm.name,
      "name": this.users.get(expenseForm.name)?.name || '',
      "type": expenseForm.type,
      "sharedBy": sharedBy,
      "settleBy": []
    }

    this.expensesService.addExpense(obj);
    this.debtsService.updateExpenseDebt(obj);

    this.clearInput();
    this.showAlert = true;
  }

  clearInput():void {
    this.model.cost = '';
    this.model.title = '';
  }

  calcExchange() {
    return this.currencyService.calcExchangeValue(parseFloat(this.model.cost));
  }

  close(){
    this.showAlert = false;
  }

}
