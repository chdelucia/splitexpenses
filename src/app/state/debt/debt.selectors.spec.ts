import { selectEnrichedDebts } from './debt.selectors';
import { Debt } from '@shared/models';

describe('Debt Selectors', () => {
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
    u1: { id: 'u1', name: 'User 1', email: '', image: '' },
  };

  it('should select enriched debts', () => {
    const result = selectEnrichedDebts.projector(initialDebts, users);
    const resultKeys = Object.keys(result);
    expect(resultKeys.length).toBe(1);
    expect(result['u1'].userName).toBe('User 1');
  });
});
