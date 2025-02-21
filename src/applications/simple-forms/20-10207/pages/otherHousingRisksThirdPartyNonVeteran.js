import VaTextareaField from 'platform/forms-system/src/js/web-component-fields/VaTextareaField';
import { titleUI } from 'platform/forms-system/src/js/web-component-patterns';

import { ADDITIONAL_INFO_OTHER_HOUSING_RISKS_3RD_PTY_NON_VET } from '../config/constants';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI(
      'Other housing risks',
      ADDITIONAL_INFO_OTHER_HOUSING_RISKS_3RD_PTY_NON_VET,
    ),
    otherHousingRisks: {
      'ui:title':
        'Tell us about other housing risks the claimant is experiencing',
      'ui:webComponentField': VaTextareaField,
      'ui:errorMessages': {
        required: 'List other housing risks the claimant is experiencing',
      },
      'ui:options': {
        charcount: true,
      },
    },
  },
  schema: {
    type: 'object',
    properties: {
      otherHousingRisks: {
        type: 'string',
        maxLength: 100,
      },
    },
    required: ['otherHousingRisks'],
  },
};
