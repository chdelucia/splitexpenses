import { Component, OnInit } from '@angular/core';
import { CurrencyService } from '../shared/currency.service';
import { DebtsService } from '../shared/debts.service';
import { CurrencyPlugin, Debt, User } from '../shared/models';
import { UsersService } from '../shared/users.service';

@Component({
  selector: 'app-debts-detail',
  templateUrl: './debts-detail.component.html',
  styleUrls: ['./debts-detail.component.less']
})
export class DebtsDetailComponent implements OnInit {
  userID: string;
  debts: Map<string, Debt>;
  myDebts: Debt | undefined;
  users: Map<string, User>;
  usersHTML: Array<User>;
  currency: CurrencyPlugin;

  constructor(
    private debtsService: DebtsService,
    private userService: UsersService,
    private currencyService: CurrencyService
  ) { 
    this.users = this.userService.getUsers();
    this.usersHTML = this.userService.getIterableUsers();
    this.debts = this.debtsService.getDebts();
    this.currency = this.currencyService.getCurrencySettings();
    this.userID = this.usersHTML[0].id;

    this.setDebts();
  }

  ngOnInit(): void {
  }
  
  calcExchange(value?: number) {
    return this.currencyService.calcExchangeValue(value || 0);
  }

  setDebts(){
    const userExist = this.users.get(this.userID);
    const myDebts = this.debts.get(this.userID); 
    if ( userExist && myDebts ){
      this.myDebts = myDebts
    }
  }
  

}
