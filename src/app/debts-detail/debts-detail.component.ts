import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DebtsService } from '../shared/debts.service';
import { Debt, IndividualDebt, User } from '../shared/models';
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
  usersHTML: Array<User>

  constructor(
    private debtsService: DebtsService,
    private route: ActivatedRoute,
    private userService: UsersService
  ) { 
    this.users = this.userService.getUsers();
    this.usersHTML = this.userService.getIterableUsers();
    this.userID = this.route.snapshot.paramMap.get('id') || '';
    this.debts = this.debtsService.getDebts();

    const userExist = this.users.get(this.userID);
    const myDebts = this.debts.get(this.userID);

    if ( userExist && myDebts ){
      this.myDebts = myDebts
    }
  }

  ngOnInit(): void {
  }

}
