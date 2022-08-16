import { Component } from '@angular/core';
import { ExpensesService } from './expenses.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent {
  title = 'splitexpenses';

  constructor(private expenses: ExpensesService){
    this.expenses.loadExpensesFromLocalStorage();
  }
}
