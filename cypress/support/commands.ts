declare namespace Cypress {
  interface Chainable {
    addIngredientByName(name: string): Chainable<void>;
  }
}

Cypress.Commands.add('addIngredientByName', (name: string) => {
  cy.contains(name).parents('li').find('button').click();
});
