import { createReducer, on } from '@ngrx/store';
import { DebtState } from './debt.model';
import { UpdateDebts } from './debt.actions';
import { Debt } from '@shared/models';

export const debtsFeatureKey = 'debts';

export const initialState: DebtState = {
  debts: new Map<string, Debt>(),
};

export const reducer = createReducer(
  initialState,
  on(
    UpdateDebts,
    (state, { debts }): DebtState => ({
      ...state,
      debts: new Map([...state.debts, ...debts]),
    }),
  ),
);
