describe("Debug Login", () => {
  it("deve abrir a página de login e verificar campos", () => {
    cy.visit("/login");
    cy.get("h1").contains("Bem-vinda de volta").should("be.visible");
    cy.get("#email").should("be.visible");
    cy.get("#password").should("be.visible");
    cy.get('button[type="submit"]').should("be.visible");
  });
});
