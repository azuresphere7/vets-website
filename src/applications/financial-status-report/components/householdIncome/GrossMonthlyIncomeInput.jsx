import React, { useState, useEffect, useCallback } from 'react';
import { useSelector, connect } from 'react-redux';
import { setData } from 'platform/forms-system/src/js/actions';
import PropTypes from 'prop-types';
import FormNavButtons from '~/platform/forms-system/src/js/components/FormNavButtons';
import { getJobIndex } from '../../utils/session';
import { isValidCurrency } from '../../utils/validations';

const GrossMonthlyIncomeInput = props => {
  const { goToPath, goBack, setFormData } = props;

  const editIndex = getJobIndex();

  const isEditing = editIndex && !Number.isNaN(editIndex);

  const index = isEditing ? Number(editIndex) : 0;

  const userType = 'veteran';

  const formData = useSelector(state => state.form.data);

  const {
    personalData: {
      employmentHistory: {
        veteran: { employmentRecords = [] } = {},
        newRecord = {},
      } = {},
    },
  } = formData;

  const MAXIMUM_GROSS_MONTHLY_INCOME = 12000;

  const employmentRecord = isEditing ? employmentRecords[index] : newRecord;

  const {
    employerName = '',
    grossMonthlyIncome: currentGrossMonthlyIncome = '',
  } = employmentRecord;

  const [incomeError, setIncomeError] = useState(false);
  const [error, setError] = useState(null);
  const [grossMonthlyIncome, setGrossMonthlyIncome] = useState({
    value: currentGrossMonthlyIncome,
    dirty: false,
  });

  const setNewGrossMonthlyIncome = event => {
    setIncomeError(!isValidCurrency(event.target.value));
    setGrossMonthlyIncome({ value: event.target.value, dirty: true });
  };

  const validateGrossMonthlyIncome = useCallback(
    () => {
      const regex = /(?=.*?\d)^\$?(([1-9]\d{0,2}(,\d{3})*)|\d+)?(\.\d{1,2})?$/;

      if (
        !grossMonthlyIncome.value ||
        (grossMonthlyIncome.value &&
          (!regex.test(grossMonthlyIncome.value) ||
            Number(grossMonthlyIncome.value) < 0))
      ) {
        setIncomeError(true);
      }
    },
    [grossMonthlyIncome],
  );

  useEffect(
    () => {
      validateGrossMonthlyIncome();
    },
    [incomeError, grossMonthlyIncome, validateGrossMonthlyIncome],
  );

  const updateFormData = e => {
    e.preventDefault();

    if (!isValidCurrency(grossMonthlyIncome.value)) {
      setIncomeError(true);
      setError('Please enter a valid amount');
      return;
    }

    if (grossMonthlyIncome.value > MAXIMUM_GROSS_MONTHLY_INCOME) {
      setIncomeError(true);
      setError('Please enter an amount less than $12,000');
      return;
    }

    if (isEditing) {
      // find the one we are editing in the employeeRecords array
      const updatedRecords = employmentRecords.map((item, arrayIndex) => {
        return arrayIndex === index
          ? {
              ...employmentRecord,
              grossMonthlyIncome: grossMonthlyIncome.value,
            }
          : item;
      });
      // update form data
      setFormData({
        ...formData,
        personalData: {
          ...formData.personalData,
          employmentHistory: {
            ...formData.personalData.employmentHistory,
            [`${userType}`]: {
              ...formData.personalData.employmentHistory[`${userType}`],
              employmentRecords: updatedRecords,
            },
          },
        },
      });
    } else {
      setFormData({
        ...formData,
        personalData: {
          ...formData.personalData,
          employmentHistory: {
            ...formData.personalData.employmentHistory,
            newRecord: {
              ...employmentRecord,
              grossMonthlyIncome: grossMonthlyIncome.value,
            },
          },
        },
      });
    }

    goToPath(`/deduction-checklist`);
  };

  const navButtons = <FormNavButtons goBack={goBack} submitToContinue />;

  return (
    <form onSubmit={updateFormData}>
      <h3 className="schemaform-block-title vads-u-margin-top--5">
        Monthly income for {employerName}
      </h3>
      <va-number-input
        label="What’s your gross monthly income at this job?"
        hint="Gross income is income before taxes and any other deductions. You can use information from your pay stub to calculate your gross monthly income."
        inputmode="numeric"
        id="gross-monthly-income"
        currency
        data-testid="gross-monthly-income"
        name="gross-monthly-income"
        onInput={setNewGrossMonthlyIncome}
        type="text"
        value={grossMonthlyIncome.value}
        required
        min={0}
        max={MAXIMUM_GROSS_MONTHLY_INCOME}
        width="md"
        error={error}
        uswds
      />
      <va-additional-info
        trigger="How to calculate your gross monthly income"
        class="vads-u-margin-top--2"
        uswds
      >
        <p className="vads-u-padding-bottom--2">
          <strong>If you’re a salaried employee,</strong> divide your annual
          salary by 12.
        </p>
        <p>
          <strong>If you’re an hourly employee,</strong> follow these steps:
        </p>
        <ol className="vads-u-margin--0 vads-u-padding-left--4 vads-u-padding-top--2 vads-u-padding-bottom--0p25">
          <li>
            Multiply your hourly rate by the number of hours you work each week
          </li>
          <li>Multiply that number by 52</li>
          <li>Divide that number by 12</li>
        </ol>
      </va-additional-info>
      {navButtons}
    </form>
  );
};

const mapStateToProps = ({ form }) => {
  return {
    formData: form.data,
    employmentHistory: form.data.personalData.employmentHistory,
  };
};

const mapDispatchToProps = {
  setFormData: setData,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(GrossMonthlyIncomeInput);

GrossMonthlyIncomeInput.propTypes = {
  goBack: PropTypes.func.isRequired,
  goToPath: PropTypes.func.isRequired,
  setFormData: PropTypes.func.isRequired,
  onReviewPage: PropTypes.bool,
};
