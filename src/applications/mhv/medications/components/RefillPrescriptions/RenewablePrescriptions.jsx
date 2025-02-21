import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { VaPagination } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { waitForRenderThenFocus } from '@department-of-veterans-affairs/platform-utilities/ui';
import { setBreadcrumbs } from '../../actions/breadcrumbs';
import { setPrescriptionDetails } from '../../actions/prescriptions';

import { dateFormat } from '../../util/helpers';
import { medicationsUrls } from '../../util/constants';

const RenewablePrescriptions = ({ renewablePrescriptionsList = [] }) => {
  // Hooks
  const dispatch = useDispatch();

  // Pagination
  const MAX_PAGE_LIST_LENGTH = 20;
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: Math.ceil(
      renewablePrescriptionsList.length / MAX_PAGE_LIST_LENGTH,
    ),
  });

  const onPageChange = page => {
    setPagination(prevState => ({
      ...prevState,
      currentPage: page,
    }));
    waitForRenderThenFocus(
      "p[data-testid='renew-page-list-count']",
      document,
      500,
    );
  };

  const startIdx = (pagination.currentPage - 1) * MAX_PAGE_LIST_LENGTH;
  const endIdx = pagination.currentPage * MAX_PAGE_LIST_LENGTH;
  const paginatedRenewablePrescriptions = renewablePrescriptionsList.slice(
    startIdx,
    endIdx,
  );

  // Functions
  const onRxLinkClick = rx => {
    dispatch(
      setBreadcrumbs({
        url: medicationsUrls.subdirectories.REFILL,
        label: 'Refill prescriptions',
      }),
    );
    dispatch(setPrescriptionDetails(rx));
  };

  return (
    <div>
      <h2 className="vads-u-margin-top--4" data-testid="renew-section-subtitle">
        If you can’t find the prescription you’re looking for
      </h2>
      <div className="vads-u-margin-y--3">
        <p className="vads-u-margin-y--0">You may need to renew it. </p>
        <p className="vads-u-margin-y--0">
          <va-link
            href={medicationsUrls.MEDICATIONS_ABOUT_ACCORDION_RENEW}
            text="Learn how to renew prescriptions"
            data-testid="learn-to-renew-prescriptions-link"
          />
        </p>
      </div>
      <div>
        <p className="vads-u-margin-y--0">
          <strong>Note:</strong> If your prescription isn’t listed here, find it
          in your medications list.{' '}
        </p>
        <p className="vads-u-margin-y--0">
          <Link data-testid="medications-page-link" to="/">
            Go to your medications list
          </Link>
        </p>
      </div>
      {renewablePrescriptionsList.length > 0 && (
        <>
          <p data-testid="renew-page-list-count">
            Showing {renewablePrescriptionsList.length} prescription
            {renewablePrescriptionsList.length !== 1 ? 's' : ''} you may need to
            renew
          </p>
          <div className="no-print rx-page-total-info vads-u-border-bottom--2px vads-u-border-color--gray-lighter" />
        </>
      )}
      <div>
        {paginatedRenewablePrescriptions.map((prescription, idx) => (
          <div
            key={idx}
            className={`vads-u-margin-top--${idx !== 0 ? '5' : '2p5'}`}
          >
            <h4 className="vads-u-margin--0">
              <Link
                data-testid={`medication-details-page-link-${idx}`}
                to={`/prescription/${prescription.prescriptionId}`}
                onClick={() => onRxLinkClick(prescription)}
              >
                {prescription.prescriptionName}
              </Link>
            </h4>
            <p className="vads-u-margin-top--0">
              Prescription number: {prescription.prescriptionNumber}
              <br />
              <span data-testid={`renew-last-filled-${idx}`}>
                Last filled on{' '}
                {dateFormat(
                  prescription.rxRfRecords.find(record => record.dispensedDate)
                    ?.dispensedDate || prescription.dispensedDate,
                  'MMMM D, YYYY',
                )}
              </span>
              {prescription?.trackingList?.[0]?.completeDateTime && (
                <>
                  <br />
                  <span data-testid={`medications-last-shipped-${idx}`}>
                    <i className="fas fa-truck vads-u-margin-right--1p5" />
                    Last refill shipped on{' '}
                    {dateFormat(
                      prescription.trackingList[0].completeDateTime,
                      'MMMM D, YYYY',
                    )}
                  </span>
                </>
              )}
            </p>
          </div>
        ))}
        <div className="renew-pagination-container">
          {renewablePrescriptionsList.length > MAX_PAGE_LIST_LENGTH && (
            <VaPagination
              max-page-list-length={MAX_PAGE_LIST_LENGTH}
              id="pagination"
              className="vads-u-justify-content--center no-print"
              onPageSelect={e => onPageChange(e.detail.page)}
              page={pagination.currentPage}
              pages={pagination.totalPages}
              unbounded
              uswds
              data-testid="renew-pagination"
            />
          )}
        </div>
      </div>
    </div>
  );
};

RenewablePrescriptions.propTypes = {
  renewablePrescriptionsList: PropTypes.array,
};

export default RenewablePrescriptions;
