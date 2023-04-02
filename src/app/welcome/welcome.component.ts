import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatStepper } from '@angular/material/stepper';
import { ExpensesService } from '../expenses/shared/expenses.service';
import { Expense, User } from '../shared/models';
import { UsersService } from '../users/shared/users.service';
import { Observable, Subscription  } from 'rxjs';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss']
})
export class WelcomeComponent implements OnInit, AfterViewInit {
  @ViewChild('stepper') stepper!: MatStepper;
  usersSize: number = 0;
  expensesSize: number = 0;
  isLinear = true;
  private expensesSubscription: Subscription | undefined;;
  private usersSubscription: Subscription | undefined;;

  constructor(
    private expensesService: ExpensesService,
    private usersService: UsersService,
    ) { }

  ngOnInit(): void {
    this.expensesService.getExpenses().subscribe(expenses => {
      this.expensesSize = expenses.size;
      if(expenses.size > 0) this.nextStep();
    });

    this.usersService.getUsers().subscribe(users => {
      this.usersSize = users.size;
      if(users.size > 1) this.nextStep();
    });
   }

   ngAfterViewInit() {
    /**this.users$.subscribe(users => {
      if(users.size > 2) {
        setTimeout(() => {
          this.nextStep();
        }, 0);
      }
    }); */
  }

  nextStep() {
    this.stepper.next();
  }

  ngOnDestroy(): void {
      this.expensesSubscription?.unsubscribe();
      this.usersSubscription?.unsubscribe();
  }
}
