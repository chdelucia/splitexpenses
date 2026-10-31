import { TestBed } from '@angular/core/testing';
import { ExpensesStore } from './expenses.store';
import { UserStore } from '@state/user/user.store';
import { Expense } from '@shared/models';

describe('ExpensesStore', () => {
  let store: InstanceType<typeof ExpensesStore>;
  let userStore: InstanceType<typeof UserStore>;

  const initialExpenses: Record<string, Expense> = {
    e1: {
      id: 'e1',
      title: 'Dinner',
      cost: 15,
      originalCost: 30,
      date: '2023-01-01',
      paidBy: 'u1',
      sharedBy: ['u1', 'u2'],
      settleBy: [],
      typeId: 'food',
    },
    e2: {
      id: 'e2',
      title: 'Lunch',
      cost: 10,
      originalCost: 20,
      date: '2023-01-02',
      paidBy: 'u2',
      sharedBy: ['u1', 'u2'],
      settleBy: [],
      typeId: 'food',
    },
  };

  const users = {
    u1: { id: 'u1', name: 'User 1' },
    u2: { id: 'u2', name: 'User 2' },
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ExpensesStore, UserStore],
    });
    store = TestBed.inject(ExpensesStore);
    userStore = TestBed.inject(UserStore);
  });

  it('should initialize with empty state', () => {
    expect(store.expenses()).toEqual({});
    expect(store.iterableExpenses()).toEqual([]);
  });

  it('should compute enriched expenses correctly', () => {
    userStore.addUsers(users);
    store.addExpenses(initialExpenses);

    const enriched = store.enrichedExpenses();
    expect(enriched.length).toBe(2);
    expect(enriched[0].paidByUserName).toBe('User 1');
    expect(enriched[0].sharedByNames).toEqual(['User 1', 'User 2']);
  });

  it('should calculate user total balance correctly', () => {
    userStore.addUsers(users);
    store.addExpenses(initialExpenses);

    expect(store.calcUserTotalBalance('u1')).toBe(5);
    expect(store.calcUserTotalBalance('u2')).toBe(-5);
  });

  it('should calculate total paid by user to others correctly', () => {
    userStore.addUsers(users);
    store.addExpenses(initialExpenses);

    expect(store.calcTotalPaidByUserToOthers('u1')).toBe(15);
    expect(store.calcTotalPaidByUserToOthers('u2')).toBe(10);
  });

  it('should calculate total cost correctly', () => {
    userStore.addUsers(users);
    store.addExpenses(initialExpenses);

    expect(store.calcTotalCost()).toBe(50);
    expect(store.calcTotalCost('u1')).toBe(25);
  });

  it('should remove and clear expenses', () => {
    store.addExpenses(initialExpenses);
    store.removeExpense('e1');
    expect(store.iterableExpenses().length).toBe(1);

    store.clearExpenses();
    expect(store.iterableExpenses().length).toBe(0);
  });
});
