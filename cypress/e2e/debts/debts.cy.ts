import expenses from '../../fixtures/expenses.json';

describe('template spec', () => {
  beforeEach(() => {
    cy.visit('/', {
      onBeforeLoad: (window) => {
        window.localStorage.setItem('Expenses', JSON.stringify(expenses));
      },
    });
  });

  it('passes', () => {
    cy.contains('Deudas');
    cy.url().should('include', '/debts');
    cy.get('[data-cy="user-debt"]').as('userDebt');
    cy.get('@userDebt').should('be.visible');
    cy.get('@userDebt').should('have.length', 4);
    cy.get('@userDebt').first().click();
    cy.contains('Balance de cuentas');
  });
});
