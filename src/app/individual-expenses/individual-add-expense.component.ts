import { Component, input, numberAttribute } from '@angular/core';
import { AddExpenseComponent } from '@expenses/add-expense/add-expense.component';

@Component({
  selector: 'app-individual-add-expense',
  standalone: true,
  imports: [AddExpenseComponent],
  template: `<app-add-expense [individualMode]="true" [id]="id()"></app-add-expense>`,
})
export class IndividualAddExpenseComponent {
  id = input<number, string | number>(0, { transform: numberAttribute });
}
