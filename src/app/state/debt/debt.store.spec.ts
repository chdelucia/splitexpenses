import { TestBed } from '@angular/core/testing';
import { DebtStore } from './debt.store';
import { UserStore } from '@state/user/user.store';
import { Debt } from '@shared/models';

describe('DebtStore', () => {
  let store: InstanceType<typeof DebtStore>;
  let userStore: InstanceType<typeof UserStore>;

  const initialDebts: Record<string, Debt> = {
    u1: {
      userName: 'u1',
      totalIveBeenPaid: 0,
      totalIPaid: 0,
      totalIowe: 0,
      debts: {},
    },
  };

  const users = {
    u1: { id: 'u1', name: 'User 1' },
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DebtStore, UserStore],
    });
    store = TestBed.inject(DebtStore);
    userStore = TestBed.inject(UserStore);
  });

  it('should initialize with empty state', () => {
    expect(store.debts()).toEqual({});
    expect(store.iterableDebts()).toEqual([]);
  });

  it('should update debts and select enriched debts', () => {
    userStore.addUsers(users);
    store.updateDebts(initialDebts);

    expect(store.iterableDebts().length).toBe(1);

    const enriched = store.enrichedDebts();
    expect(Object.keys(enriched).length).toBe(1);
    expect(enriched['u1'].userName).toBe('User 1');
  });
});
