import expenses from '../../fixtures/expenses.json';

describe('Navbar flow', () => {
  beforeEach(() => {
    cy.visit('/', {
      onBeforeLoad: (window) => {
        window.localStorage.setItem('Expenses', JSON.stringify(expenses));
      },
    });
  });

  it('Landing on debts and check color', () => {
    cy.get('[routerlink="/debts"]').as('navDebt');
    cy.get('@navDebt').should('have.class', 'active');
    cy.get('@navDebt').should(
      'have.css',
      'background-color',
      'rgb(14, 131, 136)',
    );
  });

  it('Navagation to expenses', () => {
    cy.get('[routerlink="/expense/details"]').as('navExpense');
    cy.get('@navExpense').click();
    cy.get('@navExpense').should('have.class', 'active');
    cy.get('@navExpense').should(
      'have.css',
      'background-color',
      'rgb(14, 131, 136)',
    );
  });
});
