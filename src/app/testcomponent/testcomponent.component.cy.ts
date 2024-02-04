import { TestcomponentComponent } from './testcomponent.component'

describe('TestcomponentComponent', () => {
  it('should mount', () => {
    cy.mount(TestcomponentComponent)
  })
})