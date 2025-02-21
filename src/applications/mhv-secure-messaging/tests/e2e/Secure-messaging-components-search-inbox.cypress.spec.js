import SecureMessagingSite from './sm_site/SecureMessagingSite';
import PatientInboxPage from './pages/PatientInboxPage';
import mockMessages from './fixtures/messages-response.json';
import { Locators } from './utils/constants';
import PatientErrorPage from './pages/PatientErrorPage';

describe('Secure Messaging Inbox', () => {
  it('Secure Messaging Inbox Filter Validation', () => {
    const landingPage = new PatientInboxPage();
    const site = new SecureMessagingSite();
    site.login();
    const messageDetails = landingPage.getNewMessageDetails();

    landingPage.loadInboxMessages(mockMessages, messageDetails);
    landingPage.clickAdditionalFilterButton();
    landingPage.selectDateRange('Custom');
    cy.get(Locators.FROM_TO_DATES_CONTAINER)
      .find('legend')
      .eq(0)
      .should('have.text', 'Start date (*Required)');
    cy.get(Locators.FROM_TO_DATES_CONTAINER)
      .find('legend')
      .eq(1)
      .should('have.text', 'End date (*Required)');
    cy.get(Locators.BUTTONS.FILTER).click();
    PatientErrorPage.verifyFromToDateErrorMessageText(
      0,
      'Please enter a start date.',
    );
    PatientErrorPage.verifyFromToDateErrorMessageText(
      1,
      'Please enter an end date.',
    );
  });
});
