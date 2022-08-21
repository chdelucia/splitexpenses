import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DebtsService } from '../shared/debts.service';
import { Debt, IndividualDebt } from '../shared/models';
import { UsersService } from '../shared/users.service';

@Component({
  selector: 'app-debts-detail',
  templateUrl: './debts-detail.component.html',
  styleUrls: ['./debts-detail.component.less']
})
export class DebtsDetailComponent implements OnInit {
  userName: string;
  debts: Map<string, Debt>;
  myDebts: Debt | undefined;
  users: Array<string>;

  constructor(
    private debtsService: DebtsService,
    private route: ActivatedRoute,
    private userService: UsersService
  ) { 
    this.users = this.userService.getUsers();
    this.userName = this.route.snapshot.paramMap.get('name') || '';
    this.debts = this.debtsService.getDebts();

    const userExist = this.users.indexOf(this.userName);
    const myDebts = this.debts.get(this.userName);

    if ( userExist >= 0 && myDebts ){
      this.myDebts = myDebts
    }
  }

  ngOnInit(): void {
    console.log(this.debts);
    console.log(this.myDebts);
  }

}
