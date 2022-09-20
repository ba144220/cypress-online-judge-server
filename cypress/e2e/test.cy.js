describe("Testing App", () => {
  beforeEach(() => {
    cy.visit(`https://dark-teal-coati-slip.cyclic.app/test-app`);
  });
  it("there is a button", () => {
    cy.get('[id="main-button"]').should("be.visible");
  });
  it("there is no counter", () => {
    cy.get('[id="counter"]').should("not.exist");
  });
  it("show counter after clicking on the button", () => {
    cy.get('[id="main-button"]').click();
    cy.get('[id="counter"]').should("be.exist");
    cy.get('[id="add-button"]').should("be.exist");
    cy.get('[id="minus-button"]').should("be.exist");
  });
  it("click the button serveral times", () => {
    cy.get('[id="main-button"]').click();
    cy.get('[id="counter"]').should("be.exist");
    cy.get('[id="main-button"]').click();
    cy.get('[id="counter"]').should("not.exist");
  });
  it("button text", () => {
    cy.get('[id="main-button"]').should("have.text", "show counter");
    cy.get('[id="main-button"]').click();
    cy.get('[id="counter"]').should("be.exist");
    cy.get('[id="main-button"]').should("have.text", "hide counter");
    cy.get('[id="main-button"]').click();
    cy.get('[id="main-button"]').should("have.text", "show counter");
    cy.get('[id="counter"]').should("not.exist");
  });
  it("click on +/- buttons", () => {
    cy.get('[id="main-button"]').click();
    cy.get('[id="add-button"]').click();
    cy.get('[id="add-button"]').click();
    cy.get('[id="add-button"]').click();
    cy.get('[id="minus-button"]').click();
    cy.get('[id="number"]').should("have.text", "2");
  });
  it("the number was saved", () => {
    cy.get('[id="main-button"]').click();
    cy.get('[id="add-button"]').click();
    cy.get('[id="minus-button"]').click();
    cy.get('[id="add-button"]').click();
    cy.get('[id="add-button"]').click();
    cy.get('[id="minus-button"]').click();
    cy.get('[id="main-button"]').click();
    cy.get('[id="main-button"]').click();
    cy.get('[id="number"]').should("have.text", "1");
  });
});
