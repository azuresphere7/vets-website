import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import {
  FakeProvider,
  testNumberOfErrorsOnSubmitForWebComponents,
  testNumberOfWebComponentFields,
} from '../pageTests.spec';
import formConfig from '../../../../config/form';
import generateEmployersSchemas, {
  EmployerView,
} from '../../../../config/chapters/03-health-and-employment-information/employmentHistory';

const { schema, uiSchema } = generateEmployersSchemas({
  showJobTitleField: true,
});

describe('pensions employment history', () => {
  const pageTitle = 'employment history';
  const expectedNumberOfFields = 3;
  testNumberOfWebComponentFields(
    formConfig,
    schema,
    uiSchema,
    expectedNumberOfFields,
    pageTitle,
  );

  const expectedNumberOfErrors = 3;
  testNumberOfErrorsOnSubmitForWebComponents(
    formConfig,
    schema,
    uiSchema,
    expectedNumberOfErrors,
    pageTitle,
  );

  describe('EmployerView', () => {
    it('should render a list view', () => {
      const { container } = render(
        <FakeProvider>
          <EmployerView formData={{ jobTitle: 'Contractor' }} />
        </FakeProvider>,
      );
      const text = container.querySelector('h3');
      expect(text.innerHTML).to.equal('Contractor');
    });
    it('should render a list view with a jobType', () => {
      const { container } = render(
        <FakeProvider>
          <EmployerView formData={{ jobType: 'Construction' }} />
        </FakeProvider>,
      );
      const text = container.querySelector('h3');
      expect(text.innerHTML).to.equal('Construction');
    });
  });
});
