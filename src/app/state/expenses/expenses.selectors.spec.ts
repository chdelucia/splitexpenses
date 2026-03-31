import { selectEnrichedExpenses } from './expenses.selectors';
import { Expense } from '@shared/models';

describe('Expenses Selectors', () => {
  const initialExpenses: Expense[] = [
    {
      id: 'e1',
      title: 'Dinner',
      cost: 30,
      originalCost: 30,
      date: '2023-01-01',
      paidBy: 'u1',
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
    expect(result.length).toBe(1);
    expect(result[0].paidByUserName).toBe('User 1');
    expect(result[0].sharedByNames).toEqual(['User 1', 'User 2']);
  });
});
