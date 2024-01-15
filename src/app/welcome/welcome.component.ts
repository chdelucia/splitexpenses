import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatStepper } from '@angular/material/stepper';
import { ExpensesService } from '@expenses/shared/expenses.service';
import { UsersService } from '@users/shared/users.service';
import { Subscription, combineLatest, map } from 'rxjs';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss'],
})
export class WelcomeComponent implements OnInit, OnDestroy {
  @ViewChild('stepper') stepper!: MatStepper;
  usersSize: number = 0;
  expensesSize: number = 0;
  isLinear = true;
  private subscriptions = new Subscription();

  constructor(
    private expensesService: ExpensesService,
    private usersService: UsersService,
  ) {}

  ngOnInit(): void {
    const expenses$ = this.expensesService
      .getExpenses()
      .pipe(map((expenses) => expenses.size));

    const users$ = this.usersService
      .getUsers()
      .pipe(map((users) => users.size));

    const combined$ = combineLatest([expenses$, users$]).subscribe(
      ([expensesSize, usersSize]) => {
        this.expensesSize = expensesSize;
        this.usersSize = usersSize;

        if (usersSize > 1) {
          this.nextStep();
        }
      },
    );

    this.subscriptions.add(combined$);
  }

  nextStep() {
    this.stepper.next();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
