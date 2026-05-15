import { Component } from '@angular/core';
import { ExpensesListComponent } from '@expenses/expenses-list/expenses-list.component';

@Component({
  selector: 'app-individual-expenses-list',
  standalone: true,
  imports: [ExpensesListComponent],
  template: `<app-expenses-list [monthlyFilter]="true"></app-expenses-list>`,
})
export class IndividualExpensesListComponent {}
