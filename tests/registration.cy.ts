import { generateCPF } from "./utils/cpf";

describe("Jornada de Cadastro do Cliente", () => {
  beforeEach(() => {
    cy.visit("/cadastro");
  });

  it("deve exibir erros de validação ao tentar enviar o formulário vazio", () => {
    cy.get('button[type="submit"]').click();
    
    // Verifica se os campos obrigatórios mostram erro (baseado na lógica do componente)
    cy.get("#first_name").should("have.class", "border-red-500");
    cy.get("#last_name").should("have.class", "border-red-500");
    cy.get("#email").should("have.class", "border-red-500");
    cy.get("#password").should("have.class", "border-red-500");
    cy.get("#document").should("have.class", "border-red-500");
  });

  it("deve preencher o formulário e realizar o cadastro com sucesso", () => {
    // Mock da API de registro
    cy.intercept("POST", "**/auth/register/**", {
      statusCode: 201,
      body: { success: true },
    }).as("registerRequest");

    const testUser = {
      firstName: "Teste",
      lastName: "Cypress",
      email: `test-${Date.now()}@example.com`,
      document: generateCPF(),
    };

    cy.get("#first_name").type(testUser.firstName);
    cy.get("#last_name").type(testUser.lastName);
    cy.get("#email").type(testUser.email);
    
    // Gera senha automática para evitar erros de "senha comum"
    cy.contains("Gerar Senha").click();
    
    cy.get("#document").type(testUser.document);
    cy.get("#terms").check({ force: true });

    cy.get('button[type="submit"]').click();

    // Verifica se a requisição foi feita
    // cy.wait("@registerRequest");

    // Verifica mensagem de sucesso
    cy.contains("Conta criada!").should("be.visible");
    cy.contains("Estamos te redirecionando").should("be.visible");
  });

  it("deve validar senhas que não coincidem", () => {
    cy.get("#password").type("senha123");
    cy.get("#confirmPassword").type("senha456");
    cy.get("#confirmPassword").blur();

    cy.contains("As senhas não coincidem").should("be.visible");
    cy.get("#confirmPassword").should("have.class", "border-red-500");
  });

  it("deve permitir gerar uma senha automática", () => {
    cy.contains("Gerar Senha").click();
    
    cy.get("#password").should("not.have.value", "");
    cy.get("#confirmPassword").should("not.have.value", "");
    
    // Verifica se os valores são iguais
    cy.get("#password").invoke("val").then((pass) => {
      cy.get("#confirmPassword").should("have.value", pass);
    });
  });
});
