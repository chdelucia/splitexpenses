import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Debt, TraceAutoSettle } from '@shared/models';
import {
  selectCalculatedDebts,
  selectDebtTracing,
} from '@state/debt/debt.selectors';
import { Store } from '@ngrx/store';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class DebtsService {
  private store = inject(Store);

  getDebts(): Observable<Record<string, Debt>> {
    return this.store.select(selectCalculatedDebts);
  }

  getDebtByID(id: string): Observable<Debt | undefined> {
    return this.getDebts().pipe(map(debts => debts[id]));
  }

  getIterableDebts(): Observable<Array<Debt>> {
    return this.getDebts().pipe(map(debts => Object.values(debts)));
  }

  getDebtTracing(): Observable<TraceAutoSettle[]> {
    return this.store.select(selectDebtTracing);
  }
}
