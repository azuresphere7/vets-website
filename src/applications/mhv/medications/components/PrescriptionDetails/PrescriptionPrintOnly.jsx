import React from 'react';
import PropTypes from 'prop-types';
import {
  pdfStatusDefinitions,
  pdfDefaultStatusDefinition,
} from '../../util/constants';
import { validateField, dateFormat } from '../../util/helpers';
import VaPharmacyText from '../shared/VaPharmacyText';

const PrescriptionPrintOnly = props => {
  const { rx, hideLineBreak, refillHistory, isDetailsRx } = props;
  const phoneNumber = rx?.cmopDivisionPhone || rx?.dialCmopDivisionPhone;
  const activeNonVaContent = pres => (
    <div className="print-only-rx-details-container vads-u-margin-top--1p5">
      <p>
        <strong>Instructions:</strong> {validateField(pres.sig)}
      </p>
      <p>
        <strong>Reason for use:</strong> {validateField(pres.indicationForUse)}
      </p>
      <p className="no-break">
        <strong>Status:</strong> {validateField(pres.dispStatus?.toString())}
      </p>
      <p>
        A VA provider added this medication record in your VA medical records.
        But this isn’t a prescription you filled through a VA pharmacy. You
        can’t request refills or manage this medication through this online
        tool.
      </p>
      <p className="vads-u-margin-bottom--neg2">
        <strong>Non-VA medications include these types:</strong>
      </p>
      <ul className="no-break">
        <li className="vads-u-margin--0">
          Prescriptions you filled through a non-VA pharmacy
        </li>
        <li className="vads-u-margin--0">
          Over-the-counter medications, supplements, and herbal remedies
        </li>
        <li className="vads-u-margin--0">
          Sample medications a provider gave you
        </li>
        <li className="vads-u-margin--0">
          Other drugs you’re taking that you don’t have a prescription for,
          including recreational drugs
        </li>
      </ul>
      <p className="vads-u-margin-top--neg1p5">
        <strong>When you started taking this medication:</strong>{' '}
        {dateFormat(pres.dispensedDate, 'MMMM D, YYYY')}
      </p>
      <p>
        <strong>Documented by: </strong>
        {pres.providerLastName
          ? `${pres.providerLastName}, ${pres.providerFirstName || ''}`
          : 'None noted'}
      </p>
      <p>
        <strong>Documented at this facility: </strong>
        {validateField(pres.facilityName)}
      </p>
      <p>
        <strong>Provider Notes: </strong>
        {validateField(
          (pres.remarks ?? '') + (pres.disclaimer ? ` ${pres.disclaimer}` : ''),
        )}
      </p>
    </div>
  );
  const NameElement = isDetailsRx ? 'h2' : 'h3';
  const DetailsHeaderElement = isDetailsRx ? 'h3' : 'h4';
  return (
    <div className="print-only-rx-container">
      <NameElement>
        {rx.prescriptionName ||
          (rx.dispStatus === 'Active: Non-VA' ? rx.orderableItem : '')}
      </NameElement>
      {rx?.prescriptionSource !== 'NV' ? (
        <>
          <DetailsHeaderElement>About your prescription</DetailsHeaderElement>
          <div className="print-only-rx-details-container">
            <p>
              <strong>Last filled on:</strong>{' '}
              {dateFormat(rx.dispensedDate, 'MMMM D, YYYY')}
            </p>
            <p>
              <strong>Status:</strong>{' '}
              {validateField(rx.dispStatus?.toString())}
            </p>
            <div className="vads-u-margin-y--0p5 no-break vads-u-margin-right--5">
              {pdfStatusDefinitions[rx.refillStatus]
                ? pdfStatusDefinitions[rx.refillStatus].map((def, i) => {
                    if (Array.isArray(def.value)) {
                      return (
                        <ul key={i} className="vads-u-margin--0">
                          {def.value.map((val, idx) => (
                            <li key={idx} className="vads-u-margin--0">
                              {val}
                            </li>
                          ))}
                        </ul>
                      );
                    }
                    if (def.weight === 'bold') {
                      return <strong key={i}>{def.value}</strong>;
                    }
                    return (
                      <div key={i} className="vads-u-margin-y--0p5">
                        {def.value}
                      </div>
                    );
                  })
                : pdfDefaultStatusDefinition.map(({ value }, i) => (
                    <div key={i} className="vads-u-margin-y--0p5">
                      {value}
                    </div>
                  ))}
            </div>
            <p>
              <strong>Refills left:</strong> {validateField(rx.refillRemaining)}
            </p>
            <p>
              <strong>
                Request refills by this prescription expiration date:
              </strong>{' '}
              {dateFormat(rx.expirationDate, 'MMMM D, YYYY')}
            </p>
            <p>
              <strong>Prescription number:</strong> {rx.prescriptionNumber}
            </p>
            <p>
              <strong>Prescribed on:</strong>{' '}
              {dateFormat(rx.orderedDate, 'MMMM D, YYYY')}
            </p>
            <p>
              <strong>Prescribed by:</strong>{' '}
              {(rx.providerFirstName && rx.providerLastName) || 'None noted'}
            </p>
            <p>
              <strong>Facility:</strong> {validateField(rx.facilityName)}
            </p>
            <p>
              <strong>Pharmacy phone number:</strong>{' '}
              {phoneNumber ? (
                <va-telephone contact={phoneNumber} not-clickable />
              ) : (
                'None noted'
              )}
            </p>
          </div>
          <DetailsHeaderElement>
            About this medication or supply
          </DetailsHeaderElement>
          <div className="print-only-rx-details-container">
            <p className="no-break">
              <strong>Instructions:</strong> {validateField(rx.sig)}
            </p>
            <p>
              <strong>Reason for use:</strong>{' '}
              {validateField(rx.indicationForUse)}
            </p>
            <p>
              <strong>Quantity:</strong> {validateField(rx.quantity)}
            </p>
          </div>
          {refillHistory && (
            <div className="print-only-refill-container">
              <DetailsHeaderElement>Refill history</DetailsHeaderElement>
              <div className="print-only-rx-details-container">
                {refillHistory.map((entry, i) => {
                  const index = refillHistory.length - i - 1;
                  const { shape, color, backImprint, frontImprint } = entry;
                  return (
                    <div key={index}>
                      <h4>
                        {`${index === 0 ? 'First fill' : `Refill ${index}`}`}
                      </h4>
                      <p>
                        <strong>Filled by pharmacy on:</strong>{' '}
                        {entry?.dispensedDate
                          ? dateFormat(entry.dispensedDate)
                          : 'None noted'}
                      </p>
                      <p>
                        <strong>Shipped on:</strong>{' '}
                        {entry?.trackingList?.[0]?.completeDateTime
                          ? dateFormat(entry.trackingList[0].completeDateTime)
                          : 'None noted'}
                      </p>
                      <p className="vads-u-margin--0">
                        <strong>Medication description: </strong>
                      </p>
                      {shape?.trim() &&
                      color?.trim() &&
                      frontImprint?.trim() ? (
                        <>
                          <p className="vads-u-margin--0">
                            <strong>Note:</strong> If the medication you’re
                            taking doesn’t match this description, call{' '}
                            <VaPharmacyText
                              phone={phoneNumber}
                              isNotClickable
                            />
                            .
                          </p>
                          <ul className="vads-u-margin--0">
                            <li className="vads-u-margin-y--0">
                              <strong>Shape:</strong> {shape[0].toUpperCase()}
                              {shape.slice(1).toLowerCase()}
                            </li>
                            <li className="vads-u-margin-y--0">
                              <strong>Color:</strong> {color[0].toUpperCase()}
                              {color.slice(1).toLowerCase()}
                            </li>
                            <li className="vads-u-margin-y--0">
                              <strong>Front marking:</strong> {frontImprint}
                            </li>
                            {backImprint ? (
                              <li className="vads-u-margin-y--0">
                                <strong>Back marking:</strong> {backImprint}
                              </li>
                            ) : (
                              <></>
                            )}
                          </ul>
                        </>
                      ) : (
                        <>
                          No description available. Call{' '}
                          <VaPharmacyText phone={phoneNumber} isNotClickable />{' '}
                          if you need help identifying this medication.
                        </>
                      )}
                      <div className="line-break" />
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </>
      ) : (
        activeNonVaContent(rx)
      )}
      {!hideLineBreak && <div className="line-break vads-u-margin-top--2" />}
    </div>
  );
};

export default PrescriptionPrintOnly;

PrescriptionPrintOnly.propTypes = {
  rx: PropTypes.object.isRequired,
  hideLineBreak: PropTypes.bool,
  isDetailsRx: PropTypes.bool,
  refillHistory: PropTypes.array,
};
