import React from 'react';
import { expect } from 'chai';
import { fireEvent, render } from '@testing-library/react';
import sinon from 'sinon';

import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';
import { $, $$ } from 'platform/forms-system/src/js/utilities/ui';

import formConfig from '../../config/form';

describe('HLR conference times page', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.informalConference.pages.conferenceTime;

  it('should render', () => {
    const { container } = render(
      <DefinitionTester
        definitions={{}}
        schema={schema}
        uiSchema={uiSchema}
        data={{}}
        formData={{}}
      />,
    );

    expect($$('va-radio-option', container).length).to.equal(2);
  });

  it('should allow submit', () => {
    const onSubmit = sinon.spy();
    const { container } = render(
      <DefinitionTester
        definitions={{}}
        schema={schema}
        uiSchema={uiSchema}
        data={{}}
        formData={{}}
        onSubmit={onSubmit}
      />,
    );
    const changeEvent = new CustomEvent('selected', {
      detail: { value: 'time0800to1200' },
    });
    $('va-radio', container).__events.vaValueChange(changeEvent);
    fireEvent.submit($('form', container));
    expect($('.usa-input-error-message', container)).to.not.exist;
    expect(onSubmit.called).to.be.true;
  });

  // board option is required
  it('should prevent continuing', () => {
    const onSubmit = sinon.spy();
    const { container } = render(
      <DefinitionTester
        definitions={{}}
        schema={schema}
        uiSchema={uiSchema}
        data={{}}
        formData={{}}
        onSubmit={onSubmit}
      />,
    );

    fireEvent.submit($('form', container));
    expect($$('[error]', container).length).to.equal(1);
    expect(onSubmit.called).to.be.false;
  });
});
