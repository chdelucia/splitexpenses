import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { firstValueFrom, Observable } from 'rxjs';
import { CurrencyService } from '../shared/currency.service';
import { DebtsService } from '../shared/debts.service';
import { ExpensesService } from '../expenses/shared/expenses.service';
import { CurrencyPlugin, Debt, User } from '../shared/models';
import { UsersService } from '../users/shared/users.service';

@Component({
  selector: 'app-debts-detail',
  templateUrl: './debts-detail.component.html',
  styleUrls: ['./debts-detail.component.scss']
})
export class DebtsDetailComponent implements OnInit {
  userID: string;
  debts: Map<string, Debt>;
  myDebts: Debt | undefined;
  users: Observable<Map<string, User>>;
  usersHTML: Observable<Array<User>>;
  currency: CurrencyPlugin;
  hideInfo = false;

  constructor(
    private debtsService: DebtsService,
    private userService: UsersService,
    private currencyService: CurrencyService,
    private expensesService: ExpensesService,
    private route: ActivatedRoute,
  ) {
    this.users = this.userService.getUsers();
    this.usersHTML = this.userService.getIterableUsers();
    this.currency = this.currencyService.getCurrencySettings();
    this.debts = this.debtsService.getDebts();
    this.userID = this.route.snapshot.paramMap.get('id') || '0';
  }

  ngOnInit(): void {
    this.setDebts();
    console.log(this.debts);
  }

  calcExchange(value?: number) {
    return this.currencyService.calcExchangeValue(value || 0);
  }

  async setDebts(){
    const users = await firstValueFrom(this.users)
    const userExist = users.get(this.userID);
    const myDebts = this.debts.get(this.userID);
    if ( userExist && myDebts ){
      this.myDebts = myDebts
    }
  }

  async pay(expenseID: string, userID: string, paid: boolean) {
    let expense = await firstValueFrom(this.expensesService.getExpenseByID(expenseID));
    if(expense) {

      // remove userID or added
      paid ? expense.settleBy.splice(expense.settleBy.indexOf(userID), 1) : expense.settleBy.push(userID)
      this.expensesService.editExpense(expense);
      this.recalculateDebts();

    } else {
      //TODO show toast or control errors
      console.error('error');
    }
  }

  recalculateDebts() {
    this.debtsService.reset();
    this.debts = this.debtsService.getDebts();
    this.setDebts();
  }

  closeInfo(){
    this.hideInfo = true;
  }

}
