import {
  titleUI,
  yesNoUI,
  yesNoSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  path: 'military/general',
  title: 'General history',
  uiSchema: {
    ...titleUI('Other service names'),
    serveUnderOtherNames: yesNoUI({
      title: 'Did you serve under another name?',
      classNames: 'vads-u-margin-bottom--2',
    }),
  },
  schema: {
    type: 'object',
    required: ['serveUnderOtherNames'],
    properties: {
      serveUnderOtherNames: yesNoSchema,
    },
  },
};
