import { createAction, props } from '@ngrx/store';

import { Debt } from '@shared/models';

export const UpdateDebts = createAction(
  '[Debts] Update debts',
  props<{ debts: Map<string, Debt> }>(),
);
