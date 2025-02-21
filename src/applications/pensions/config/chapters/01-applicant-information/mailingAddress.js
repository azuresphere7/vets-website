import {
  addressSchema,
  addressUI,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  title: 'Mailing address',
  path: 'applicant/mail-address',
  uiSchema: {
    ...titleUI('Mailing address'),
    veteranAddress: addressUI({
      labels: {
        militaryCheckbox:
          'I receive mail outside of the United States on a U.S. military base',
      },
      omit: ['street3'],
    }),
  },
  schema: {
    type: 'object',
    required: ['veteranAddress'],
    properties: {
      veteranAddress: addressSchema({ omit: ['street3'] }),
    },
  },
};
