import { Given, Then } from "@badeball/cypress-cucumber-preprocessor";

Given("I visit the home page", () => {
  cy.visit("/");
});

Then("the header should be visible", () => {
  cy.get("h1").should("be.visible");
});
