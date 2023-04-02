import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatStepper } from '@angular/material/stepper';
import { ExpensesService } from '../expenses/shared/expenses.service';
import { Expense, User } from '../shared/models';
import { UsersService } from '../users/shared/users.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss']
})
export class WelcomeComponent implements OnInit, AfterViewInit {
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
