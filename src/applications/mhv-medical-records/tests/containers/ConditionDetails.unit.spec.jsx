import { expect } from 'chai';
import React from 'react';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import { fireEvent, waitFor } from '@testing-library/dom';
import { beforeEach } from 'mocha';
import reducer from '../../reducers';
import { user } from '../fixtures/user-reducer.json';
import ConditionDetails from '../../containers/ConditionDetails';
import { convertCondition } from '../../reducers/conditions';
import condition from '../fixtures/condition.json';
import conditionWithFieldsMissing from '../fixtures/conditionWithFieldsMissing.json';

describe('Condition details container', () => {
  const initialState = {
    mr: { conditions: { conditionDetails: convertCondition(condition) } },
    featureToggles: {
      // eslint-disable-next-line camelcase
      mhv_medical_records_allow_txt_downloads: true,
    },
    user,
  };

  let screen;
  beforeEach(() => {
    screen = renderWithStoreAndRouter(<ConditionDetails runningUnitTest />, {
      initialState,
      reducers: reducer,
      path: '/conditions/6a2be107-501e-458f-8f17-0ada297d34d8',
    });
  });

  it('renders without errors', () => {
    expect(screen).to.exist;
  });

  it('displays a print button', () => {
    const printButton = screen.getByTestId('print-download-menu');
    expect(printButton).to.exist;
  });

  it('displays the condition name', () => {
    const conditionName = screen.getByText(
      initialState.mr.conditions.conditionDetails.name.split(' (')[0],
      {
        exact: true,
        selector: 'h1',
      },
    );
    expect(conditionName).to.exist;
  });

  it('displays the formatted received date', () => {
    const formattedDate = screen.getAllByText('February', {
      exact: false,
      selector: 'span',
    });
    expect(formattedDate).to.exist;
  });

  it('displays the location', () => {
    const location = screen.getAllByText(
      initialState.mr.conditions.conditionDetails.facility,
      {
        exact: true,
        selector: 'p',
      },
    );
    expect(location).to.exist;
  });

  it('should display a download started message when the download pdf button is clicked', () => {
    fireEvent.click(screen.getByTestId('printButton-1'));
    expect(screen.getByTestId('download-success-alert-message')).to.exist;
  });

  it('should display a download started message when the download txt file button is clicked', () => {
    fireEvent.click(screen.getByTestId('printButton-2'));
    expect(screen.getByTestId('download-success-alert-message')).to.exist;
  });
});

describe('Condition details container with fields missing', () => {
  const initialState = {
    mr: {
      conditions: {
        conditionDetails: convertCondition(conditionWithFieldsMissing),
      },
    },
    user,
  };

  let screen;
  beforeEach(() => {
    screen = renderWithStoreAndRouter(<ConditionDetails runningUnitTest />, {
      initialState,
      reducers: reducer,
      path: '/conditions/123',
    });
  });

  it('should not display the formatted date if date is missing', () => {
    waitFor(() => {
      expect(screen.queryByTestId('header-time').innerHTML).to.contain(
        'None noted',
      );
    });
  });
});

describe('Condition details container still loading', () => {
  const initialState = {
    user,
    mr: {
      conditions: {},
      alerts: {
        alertList: [],
      },
    },
  };

  let screen;
  beforeEach(() => {
    screen = renderWithStoreAndRouter(<ConditionDetails runningUnitTest />, {
      initialState,
      reducers: reducer,
      path: '/allergies/123',
    });
  });

  it('displays a loading indicator', () => {
    expect(screen.getByTestId('loading-indicator')).to.exist;
  });
});

describe('Health conditions details container with errors', () => {
  it('displays an error', async () => {
    const initialState = {
      user,
      mr: {
        conditions: {},
        alerts: {
          alertList: [
            {
              datestamp: '2023-10-10T16:03:28.568Z',
              isActive: true,
              type: 'error',
            },
            {
              datestamp: '2023-10-10T16:03:28.572Z',
              isActive: true,
              type: 'error',
            },
          ],
        },
      },
    };

    const screen = renderWithStoreAndRouter(
      <ConditionDetails runningUnitTest />,
      {
        initialState,
        reducers: reducer,
        path: '/conditions/123',
      },
    );

    await waitFor(() => {
      expect(
        screen.getByText(
          'We can’t access your health conditions records right now',
          {
            exact: false,
          },
        ),
      ).to.exist;
    });
  });
});
