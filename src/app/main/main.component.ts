import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ExpensesService } from '../expenses/shared/expenses.service';
import { Expense, User } from '../shared/models';
import { UsersService } from '../users/shared/users.service';
import { MatStepper } from '@angular/material/stepper';


@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit, AfterViewInit   {
  @ViewChild('stepper') stepper!: MatStepper;
  users$: Observable<Map<string, User>>;
  expenses$: Observable<Map<string, Expense>>

  isLinear = true;

  constructor(
    private expensesService: ExpensesService,
    private usersService: UsersService,
    ) {
    this.expenses$ = this.expensesService.getExpenses();
    this.users$ =  this.usersService.getUsers();
  }

  ngOnInit(): void {
    this.expenses$.subscribe(x => console.log(x));
   }

   ngAfterViewInit() {
    this.users$.subscribe(users => {
      if(users.size > 2) {
        setTimeout(() => {
          this.nextStep();
        }, 0);
      }
    });
  }


  nextStep() {
    this.stepper.next();
  }

}
