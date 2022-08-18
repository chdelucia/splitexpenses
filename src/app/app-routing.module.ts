import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddExpenseComponent } from './add-expense/add-expense.component';
import { AddUserComponent } from './add-user/add-user.component';
import { ExpensesListComponent } from './expenses-list/expenses-list.component';
import { MainComponent } from './main/main.component';
import { SummarygraphComponent } from './summarygraph/summarygraph.component';

const routes: Routes = [
  { path: '',   component: MainComponent, pathMatch: 'full' },
  { path: 'expense',   component: AddExpenseComponent },
  { path: 'details', component: ExpensesListComponent },
  { path: 'users', component: AddUserComponent },
  { path: 'help', component: SummarygraphComponent },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
