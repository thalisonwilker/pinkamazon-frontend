describe("Jornada do Usuário Autenticado", () => {
  const email = "test123@easygestor.com";
  const password = "1jgaFV0y1u0Zc!";

  it("deve realizar a jornada completa: login, editar dados, endereços e configurações", () => {
    // 1. Login com Intercept para Debug
    cy.intercept("POST", "**/api/v1/auth/login/").as("loginRequest");
    
    cy.visit("/login");
    cy.get("#email").type(email, { delay: 10 });
    cy.get("#password").type(password, { delay: 10 });
    cy.get('button[type="submit"]').click();
    
    // Aguarda a requisição e verifica o status
    cy.wait("@loginRequest", { timeout: 15000 }).then((interception) => {
      if (interception.response?.statusCode !== 200) {
        throw new Error(`Login falhou com status ${interception.response?.statusCode}: ${JSON.stringify(interception.response?.body)}`);
      }
    });

    cy.url({ timeout: 10000 }).should("include", "/minha-conta");

    // 2. Editar Dados Pessoais
    cy.contains("button", "Meus Dados").click({ force: true });
    const randomName = "Test " + Math.random().toString(36).substring(7);
    cy.get("#first_name", { timeout: 10000 }).should("be.visible").clear().type(randomName);
    cy.get('button[type="submit"]').contains("Salvar alterações").click();
    cy.contains("Sucesso!", { timeout: 15000 }).should("be.visible");

    // 3. Meus Endereços (Adicionar Novo)
    cy.contains("button", "Endereços").click({ force: true });
    cy.contains("h2", "Meus Endereços").should("be.visible");
    cy.get('button').contains(/Adicionar/i).first().click({ force: true });
    cy.contains("h3", "Novo Endereço", { timeout: 10000 }).should("be.visible");
    
    // Preenche formulário de endereço
    cy.get('input[placeholder*="Minha Casa"]').type("Escritório");
    cy.get('input[placeholder*="completo de quem receberá"]').type("Test User");
    cy.get('input[placeholder="00000-000"]').type("04571010"); // Berrini, SP
    
    // Aguarda preenchimento automático
    cy.get('input[placeholder*="Av. Principal"]').should('not.have.value', '', { timeout: 10000 });
    
    cy.get('input[placeholder="123"]').type("500");
    cy.get('button[type="submit"]').contains("Confirmar Endereço").click({ force: true });
    cy.contains("Sucesso!", { timeout: 15000 }).should("be.visible");

    // 4. Configurações e Senha
    cy.contains("button", "Configurações").click({ force: true });
    cy.contains("h2", "Configurações").should("be.visible");
    cy.contains("button", "Alterar senha").click({ force: true });
    cy.contains("h3", "Alterar Senha").should("be.visible");
    
    cy.get('#old_password').type(password);
    cy.get('#new_password').type("NewSecurePass123!");
    cy.get('#new_password_confirm').type("NewSecurePass123!");
    
    // Fecha modal
    cy.get('button').find('svg').then($svg => {
        cy.wrap($svg).closest('button').click({ force: true, multiple: true });
    });
  });
});
