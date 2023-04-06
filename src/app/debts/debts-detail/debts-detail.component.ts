import { Component, OnInit, AfterViewInit  } from '@angular/core';
import { firstValueFrom, Observable } from 'rxjs';
import { CurrencyService } from '../../shared/currency.service';
import { ExpensesService } from '../../expenses/shared/expenses.service';
import { CurrencyPlugin, Debt, Expense, User } from '../../shared/models';
import { UsersService } from '../../users/shared/users.service';
import { DebtsService } from '../shared/debts.service';
import { round2decimals } from 'src/app/shared/utils';
import { MatTable } from '@angular/material/table';
import * as XLSX from 'xlsx'


@Component({
  selector: 'app-debts-detail',
  templateUrl: './debts-detail.component.html',
  styleUrls: ['./debts-detail.component.scss']
})
export class DebtsDetailComponent implements OnInit, AfterViewInit {
  debts: Map<string, Debt>;
  users$: Observable<Array<User>>;
  currency: CurrencyPlugin;
  expenses$: Observable<Expense[]>;
  displayedColumns: string[] = [];

  constructor(
    private debtsService: DebtsService,
    private userService: UsersService,
    private currencyService: CurrencyService,
    private expensesService: ExpensesService,
  ) {
    this.users$ = this.userService.getIterableUsers();
    this.currency = this.currencyService.getCurrencySettings();
    this.debts = this.debtsService.getDebts();
    this.expenses$ = this.expensesService.getIterableExpenses();
  }


  ngOnInit(): void {
    this.initColumns();
  }

  ngAfterViewInit() {

  }

  initColumns(): void {
    this.users$.subscribe(users => {
      let userNames = users.map(user => user.name)
      this.displayedColumns = ['title', 'originalCost', ...userNames];
    })
  }

  calcExchange(value?: number) {
    return this.currencyService.calcExchangeValue(value || 0);
  }

  getTotalAmount(userId: string): number {
    //let total = this.debts.get(userId)?.totalIowe;
    let total = 0;

    this.expenses$.subscribe(expenses => {
      expenses.forEach(expense => {
        let paidByme = userId === expense.paidBy;
        let Iparticipated = expense.sharedBy.includes(userId);
        if(paidByme){
          total += expense.originalCost;
        }
        if(Iparticipated){
          total -= expense.cost;
        }
      })
    })
    return round2decimals(total);
  }

  getTotalUserPaid(expense: Expense, userId: string): number {
    let total = -expense.cost;
    let paidByme = userId === expense.paidBy;
    let Iparticipated = expense.sharedBy.includes(userId);
    if(paidByme){
      total += expense.originalCost;
      if(!Iparticipated){
        total += expense.cost;
      }
    }
    return total;
  }

  exportToExcel() {
    //this.expensesService.exportTableToExcel(this.expenses$, 'Balance de cuentas');
  }


  exportTableToExcel(dataSource: any, sheetName: string) {
    const workbook: XLSX.WorkBook = XLSX.utils.book_new();
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(dataSource);
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
    XLSX.writeFile(workbook, `${sheetName}.xlsx`);
  }

}
