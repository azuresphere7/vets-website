import Timeouts from 'platform/testing/e2e/timeouts';

import { mockUser } from './login';

describe('Address Validations', () => {
  const mockAddressResponse = (
    confidenceScore = 100,
    deliveryPointValidation = 'CONFIRMED',
  ) => {
    return {
      addresses: [
        {
          address: {
            addressLine1: '3833 Howlett Hill Rd',
            addressType: 'DOMESTIC',
            city: 'Syracuse',
            countryName: 'United States',
            countryCodeIso3: 'USA',
            countyCode: '36067',
            countyName: 'Onondaga',
            stateCode: 'NY',
            zipCode: '13215',
            zipCodeSuffix: '8688',
          },
          addressMetaData: {
            confidenceScore,
            addressType: 'Domestic',
            deliveryPointValidation,
            residentialDeliveryIndicator: 'RESIDENTIAL',
          },
        },
      ],
      validationKey: 1232036439,
    };
  };

  beforeEach(() => {
    cy.intercept('GET', '/vye/v1/*', { statusCode: 200 });
    cy.intercept('GET', '/v0/feature_toggles?*', { statusCode: 200 });
    cy.intercept('GET', '/data/cms/vamc-ehr.json', { statusCode: 200 });
    cy.visit('/education/verify-your-enrollment/', {
      onBeforeLoad: win => {
        /* eslint no-param-reassign: "error" */
        win.isProduction = true;
      },
    });
  });
  it('should not show suggested address if address is correct', () => {
    cy.injectAxeThenAxeCheck();
    cy.get('[href="/education/verify-your-enrollment/benefits-profile/"]', {
      timeout: Timeouts.slow,
    }).click();
    cy.get('[id="VYE-mailing-address-button"]').click();
    cy.get('input[id="root_fullName"]').type('Jhon Doe');
    cy.get('[id="root_countryCodeIso3"]').select('United States');
    cy.get('input[id="root_addressLine1"]').type('322 26th ave apt 1');
    cy.get('input[id="root_city"]').type('San Francisco');
    cy.get('[id="root_stateCode"]').select('California');
    cy.get('input[id="root_zipCode"]').type('94121');
    cy.get(
      '[aria-label="save your Mailing address for GI Bill benefits"]',
    ).click();
  });
  it('should show suggested address when address is partially correct', () => {
    cy.injectAxeThenAxeCheck();
    cy.intercept('POST', `/v0/profile/address_validation`, {
      statusCode: 200,
      body: mockAddressResponse(92, 'CONFIRMED'),
    }).as('submitAddress');
    cy.get('[href="/education/verify-your-enrollment/benefits-profile/"]', {
      timeout: Timeouts.slow,
    }).click();
    cy.get('[id="VYE-mailing-address-button"]').click();
    cy.get('input[id="root_fullName"]').type('Jhon Doe');
    cy.get('[id="root_countryCodeIso3"]').select('United States');
    cy.get('input[id="root_addressLine1"]').type('322 26th ave');
    cy.get('input[id="root_city"]').type('San Francisco');
    cy.get('[id="root_stateCode"]').select('California');
    cy.get('input[id="root_zipCode"]').type('94121');
    cy.get(
      '[aria-label="save your Mailing address for GI Bill benefits"]',
    ).click();
    cy.wait('@submitAddress');
    cy.get('input[id="suggested-address"]').should('exist');
    cy.get('input[id="suggested-address"]').should('be.checked');
  });
  it('should not give suggessted address if confidenceScore is 100 ', () => {
    cy.injectAxeThenAxeCheck();
    cy.intercept('POST', `/v0/profile/address_validation`, {
      statusCode: 200,
      body: mockAddressResponse(),
    }).as('submitAddress');
    cy.get('[href="/education/verify-your-enrollment/benefits-profile/"]', {
      timeout: Timeouts.slow,
    }).click();
    cy.get('[id="VYE-mailing-address-button"]').click();
    cy.get('input[id="root_fullName"]').type('Jhon Doe');
    cy.get('[id="root_countryCodeIso3"]').select('United States');
    cy.get('input[id="root_addressLine1"]').type('322 26th ave');
    cy.get('input[id="root_city"]').type('San Francisco');
    cy.get('[id="root_stateCode"]').select('California');
    cy.get('input[id="root_zipCode"]').type('94121');
    cy.get(
      '[aria-label="save your Mailing address for GI Bill benefits"]',
    ).click();
    cy.wait('@submitAddress');
    cy.login(mockUser);
    cy.intercept('POST', `/vye/v1/address`, {
      status: 201,
      ok: true,
    }).as('updateAddress');
  });
  it('should show We can’t confirm the address Alert if address in completely wrong', () => {
    cy.injectAxeThenAxeCheck();
    cy.intercept('POST', `/v0/profile/address_validation`, {
      statusCode: 200,
      body: mockAddressResponse(92, 'MISSING_ZIP'),
    }).as('submitAddress');
    cy.get('[href="/education/verify-your-enrollment/benefits-profile/"]', {
      timeout: Timeouts.slow,
    }).click();
    cy.get('[id="VYE-mailing-address-button"]').click();
    cy.get('input[id="root_fullName"]').type('Jhon Doe');
    cy.get('[id="root_countryCodeIso3"]').select('United States');
    cy.get('input[id="root_addressLine1"]').type('322 26th ave');
    cy.get('input[id="root_city"]').type('Oakland');
    cy.get('[id="root_stateCode"]').select('New York');
    cy.get('input[id="root_zipCode"]').type('43576');
    cy.get(
      '[aria-label="save your Mailing address for GI Bill benefits"]',
    ).click();
    cy.wait('@submitAddress');
    cy.get('p[data-testid]').should(
      'contain',
      'We can’t confirm the address you entered with the U.S. Postal Service. Confirm that you want us to use this address as you entered it. Or, go back to edit it.',
    );
  });
  it('should show that the address may need a unit number if unit number is missing', () => {
    cy.injectAxeThenAxeCheck();
    cy.intercept('POST', `/v0/profile/address_validation`, {
      statusCode: 200,
      body: mockAddressResponse(
        98,
        'STREET_NUMBER_VALIDATED_BUT_MISSING_UNIT_NUMBER',
      ),
    }).as('submitAddress');
    cy.get('[href="/education/verify-your-enrollment/benefits-profile/"]', {
      timeout: Timeouts.slow,
    }).click();
    cy.get('[id="VYE-mailing-address-button"]').click();
    cy.get('input[id="root_fullName"]').type('Jhon Doe');
    cy.get('[id="root_countryCodeIso3"]').select('United States');
    cy.get('input[id="root_addressLine1"]').type('322 26th ave');
    cy.get('input[id="root_city"]').type('San Francisco');
    cy.get('[id="root_stateCode"]').select('California');
    cy.get('input[id="root_zipCode"]').type('94121');
    cy.get(
      '[aria-label="save your Mailing address for GI Bill benefits"]',
    ).click();
    cy.wait('@submitAddress');
    cy.get('p[data-testid]').should(
      'contain',
      'U.S. Postal Service records show this address may need a unit number. Confirm that you want us to use this address as you entered it. Or, go back to edit and add a unit number.',
    );
  });
  it('should show that there may be a problem with the unit number for this address Alert if unit number doesnot exist within the address', () => {
    cy.injectAxeThenAxeCheck();
    cy.intercept('POST', `/v0/profile/address_validation`, {
      statusCode: 200,
      body: mockAddressResponse(
        94,
        'STREET_NUMBER_VALIDATED_BUT_BAD_UNIT_NUMBER',
      ),
    }).as('submitAddress');
    cy.get('[href="/education/verify-your-enrollment/benefits-profile/"]', {
      timeout: Timeouts.slow,
    }).click();
    cy.get('[id="VYE-mailing-address-button"]').click();
    cy.get('input[id="root_fullName"]').type('Jhon Doe');
    cy.get('[id="root_countryCodeIso3"]').select('United States');
    cy.get('input[id="root_addressLine1"]').type('322 26th ave apt 45');
    cy.get('input[id="root_city"]').type('San Francisco');
    cy.get('[id="root_stateCode"]').select('California');
    cy.get('input[id="root_zipCode"]').type('94121');
    cy.get(
      '[aria-label="save your Mailing address for GI Bill benefits"]',
    ).click();
    cy.wait('@submitAddress');
    cy.get('p[data-testid]').should(
      'contain',
      'U.S. Postal Service records show that there may be a problem with the unit number for this address. Confirm that you want us to use this address as you entered it. Or, cancel to edit the address.',
    );
  });
  it('should update the address if user choose the Suggested address ', () => {
    cy.injectAxeThenAxeCheck();
    cy.intercept('POST', `/v0/profile/address_validation`, {
      statusCode: 200,
      body: mockAddressResponse(92, 'CONFIRMED'),
    }).as('submitAddress');
    cy.get('[href="/education/verify-your-enrollment/benefits-profile/"]', {
      timeout: Timeouts.slow,
    }).click();
    cy.get('[id="VYE-mailing-address-button"]').click();
    cy.get('input[id="root_fullName"]').type('Jhon Doe');
    cy.get('[id="root_countryCodeIso3"]').select('United States');
    cy.get('input[id="root_addressLine1"]').type('322 26th ave');
    cy.get('input[id="root_city"]').type('San Francisco');
    cy.get('[id="root_stateCode"]').select('California');
    cy.get('input[id="root_zipCode"]').type('94121');
    cy.get(
      '[aria-label="save your Mailing address for GI Bill benefits"]',
    ).click();
    cy.wait('@submitAddress');
    cy.intercept('POST', `/vye/v1/address`, {
      status: 201,
      ok: true,
    }).as('updateAddress');
    cy.get('[text="Update"]').click();
    cy.wait('@updateAddress');
    cy.get('p[data-testid="alert"]').should(
      'contain',
      'Your Address has been successfully updated.',
    );
  });
  it('should not update the address if there is something went wrong ', () => {
    cy.injectAxeThenAxeCheck();
    cy.intercept('POST', `/v0/profile/address_validation`, {
      statusCode: 200,
      body: mockAddressResponse(92, 'CONFIRMED'),
    }).as('submitAddress');
    cy.get('[href="/education/verify-your-enrollment/benefits-profile/"]', {
      timeout: Timeouts.slow,
    }).click();
    cy.get('[id="VYE-mailing-address-button"]').click();
    cy.get('input[id="root_fullName"]').type('Jhon Doe');
    cy.get('[id="root_countryCodeIso3"]').select('United States');
    cy.get('input[id="root_addressLine1"]').type('322 26th ave');
    cy.get('input[id="root_city"]').type('San Francisco');
    cy.get('[id="root_stateCode"]').select('California');
    cy.get('input[id="root_zipCode"]').type('94121');
    cy.get(
      '[aria-label="save your Mailing address for GI Bill benefits"]',
    ).click();
    cy.wait('@submitAddress');
    cy.intercept('POST', `/vye/v1/address`, {
      statusCode: 401,
      body: { error: 'some error' },
    }).as('updateAddress');
    cy.get('[text="Update"]').click();
    cy.wait('@updateAddress');
    cy.get('p[data-testid="alert"]').should(
      'contain',
      'We’re sorry. We can’t update your information right now. We’re working to fix this problem. Please try again later.',
    );
  });
});
