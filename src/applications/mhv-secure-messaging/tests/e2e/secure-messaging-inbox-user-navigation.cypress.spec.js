import SecureMessagingSite from './sm_site/SecureMessagingSite';
import PatientInboxPage from './pages/PatientInboxPage';
import PatientComposePage from './pages/PatientComposePage';
import mockSignature from './fixtures/signature-response.json';
import { AXE_CONTEXT, Data, Paths } from './utils/constants';

describe('Secure Messaging Compose', () => {
  it('can send message', () => {
    const landingPage = new PatientInboxPage();
    const composePage = new PatientComposePage();
    const site = new SecureMessagingSite();
    site.login();
    landingPage.loadInboxMessages();

    cy.intercept('GET', Paths.INTERCEPT.MESSAGE_SIGNATURE, mockSignature).as(
      'signature',
    );
    landingPage.navigateToComposePage();
    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT, {});
    composePage.selectRecipient('CAMRY_PCMM RELATIONSHIP_05092022_SLC4', {
      force: true,
    });
    cy.get(`[data-testid="compose-message-categories"]`)
      .shadow()
      .get('input[value=COVID]')
      .click({ force: true });
    composePage.attachMessageFromFile(Data.TEST_IMAGE, { force: true });
    composePage
      .getMessageSubjectField()
      .type(Data.TEST_SUBJECT, { force: true });

    composePage
      .getMessageBodyField()
      .type(Data.TEST_MESSAGE_BODY, { force: true });
    composePage.pushSendMessageWithKeyboardPress();
    composePage.verifySendMessageConfirmationMessageText();
    // landingPage.verifyInboxHeader('Inbox');
  });
});
