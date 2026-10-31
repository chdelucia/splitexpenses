import { Routes } from '@angular/router';
import { DebtsComponent } from './debts.component';
import { DebtsDetailComponent } from './debts-detail/debts-detail.component';

export const routes: Routes = [
  {
    path: '',
    children: [
      { path: '', component: DebtsComponent },
      { path: 'details', component: DebtsDetailComponent },
    ],
  },
];
