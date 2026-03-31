import {
  selectEnrichedExpenses,
  selectUserTotalBalance,
  selectTotalPaidByUserToOthers,
  selectTotalCost,
} from './expenses.selectors';
import { Expense } from '@shared/models';

describe('Expenses Selectors', () => {
  const initialExpenses: Expense[] = [
    {
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
    {
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
  ];

  const users = {
    u1: { id: 'u1', name: 'User 1', email: '', image: '' },
    u2: { id: 'u2', name: 'User 2', email: '', image: '' },
  };

  it('should select enriched expenses', () => {
    const result = selectEnrichedExpenses.projector(initialExpenses, users);
    expect(result.length).toBe(2);
    expect(result[0].paidByUserName).toBe('User 1');
    expect(result[0].sharedByNames).toEqual(['User 1', 'User 2']);
  });

  it('should calculate user total balance correctly', () => {
    // u1 paid 30, owes 15 (e1) + 10 (e2) = 25. Balance = 30 - 25 = 5.
    const result = selectUserTotalBalance('u1').projector(initialExpenses);
    expect(result).toBe(5);

    // u2 paid 20, owes 15 (e1) + 10 (e2) = 25. Balance = 20 - 25 = -5.
    const result2 = selectUserTotalBalance('u2').projector(initialExpenses);
    expect(result2).toBe(-5);
  });

  it('should calculate total paid by user to others correctly', () => {
    // u1 paid 30, but 15 was for themselves. Paid to others = 15.
    const result =
      selectTotalPaidByUserToOthers('u1').projector(initialExpenses);
    expect(result).toBe(15);

    // u2 paid 20, but 10 was for themselves. Paid to others = 10.
    const result2 =
      selectTotalPaidByUserToOthers('u2').projector(initialExpenses);
    expect(result2).toBe(10);
  });

  it('should calculate total cost correctly', () => {
    // Total original cost = 30 + 20 = 50.
    const result = selectTotalCost().projector(initialExpenses);
    expect(result).toBe(50);

    // Total cost for u1 = 15 + 10 = 25.
    const result2 = selectTotalCost('u1').projector(initialExpenses);
    expect(result2).toBe(25);
  });
});
