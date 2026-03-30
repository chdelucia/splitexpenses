import { Routes } from '@angular/router';
import { DebtsComponent } from './debts.component';
import { DebtsDetailComponent } from './debts-detail/debts-detail.component';
import { provideState } from '@ngrx/store';
import * as fromDebt from '@state/debt/debt.reducer';

export const routes: Routes = [
  {
    path: '',
    providers: [provideState(fromDebt.debtsFeatureKey, fromDebt.reducer)],
    children: [
      { path: '', component: DebtsComponent },
      { path: 'details', component: DebtsDetailComponent },
    ],
  },
];
