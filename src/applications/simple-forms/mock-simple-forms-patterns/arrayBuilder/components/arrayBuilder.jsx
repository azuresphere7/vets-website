/* eslint-disable no-unused-vars */
import { YesNoField } from 'platform/forms-system/src/js/web-component-fields';
import {
  createArrayBuilderItemAddPath,
  onNavForwardKeepUrlParams,
  onNavBackKeepUrlParams,
  onNavBackRemoveAddingItem,
  createArrayBuilderUpdatedPath,
  getArrayIndexFromPathName,
  initGetText,
} from '../helpers';
import ArrayBuilderItemPage from './ArrayBuilderItemPage';
import ArrayBuilderSummaryPage from './ArrayBuilderSummaryPage';
import { DEFAULT_ARRAY_BUILDER_TEXT } from './arrayBuilderText';

/**
 * @typedef {Object} ArrayBuilderPages
 * @property {function(FormConfigPage): FormConfigPage} summaryPage Summary page which includes Cards with edit/remove, and the Yes/No field
 * @property {function(FormConfigPage): FormConfigPage} [itemPage] A repeated page corresponding to an item
 */

/**
 * @typedef {Object} ArrayBuilderOptions
 * @property {string} arrayPath the formData key for the array e.g. `"employers"` for `formData.employers`
 * @property {string} nounSingular Used for text in cancel, remove, and modals. Used with nounPlural
 * ```
 * // Example:
 * nounSingular: "employer"
 * nounPlural: "employers"
 * ```
 * @property {string} nounPlural Used for text in cancel, remove, and modals. Used with nounSingular
 * ```
 * // Example:
 * nounSingular: "employer"
 * nounPlural: "employers"
 * ```
 * @property {(item) => boolean} [isItemIncomplete] Will display error on the cards if item is incomplete. e.g. `item => !item?.name`
 * @property {string} [reviewPath] Defaults to `'review-and-submit'` if not provided.
 * @property {{
 *   getItemName?: (item) => string | JSX.Element,
 *   cardDescription?: (item) => string,
 * }} [text] optional text overrides
 */

function throwErrorPage(pageType, option) {
  throw new Error(
    `arrayBuilderPages \`pageBuilder.${pageType}()\` must include \`${option}\` property like this: ` +
      `\`...arrayBuilderPages(options, pageBuilder => ({ examplePage: pageBuilder.${pageType}({ ${option}: ... }) }))\``,
  );
}

function throwErrorOption(option) {
  throw new Error(
    `arrayBuilderPages options must include \`${option}\` property like this: ` +
      `\`...arrayBuilderPages({ ${option}: ... }, pageBuilder => { ... })\``,
  );
}

function throwErrorNoOptionsOrCallbackFunction() {
  throw new Error(
    'arrayBuilderPages must include options and a callback like this `...arrayBuilderPages(options, pageBuilder => { ... })`',
  );
}

function throwMissingYesNoField() {
  throw new Error(
    "arrayBuilderPages `pageBuilder.summaryPage()` must include a `uiSchema` that has a property with a `'ui:webComponentField': YesNoField`",
  );
}

function throwMissingYesNoValidation() {
  throw new Error(
    "arrayBuilderPages `pageBuilder.summaryPage()` must include a `uiSchema` that is using `arrayBuilderYesNoUI` pattern instead of `yesNoUI` pattern, or a similar pattern including `yesNoUI` with `'ui:validations'`",
  );
}

function throwIncorrectItemPath() {
  throw new Error(
    'arrayBuilderPages item pages must include a `path` property that includes `/:index`',
  );
}

function throwValidateRequired() {
  throw new Error(
    'arrayBuilderPages options must include a `required` boolean or function that returns a boolean. If `required` returns `true`, the flow should start with an "intro" page and expects at least 1 item from the user. If `required` returns `false`, the user can choose to skip the array entirely with a yes no question on the "summary" page.',
  );
}

function verifyRequiredArrayBuilderOptions(options, requiredOpts) {
  requiredOpts.forEach(option => {
    if (options[option] === undefined) {
      if (option === 'required') {
        throwValidateRequired();
      } else {
        throwErrorOption(option);
      }
    }
  });
}

function verifyRequiredPropsPageConfig(pageType, requiredOpts, objectToCheck) {
  requiredOpts.forEach(option => {
    if (objectToCheck[option] === undefined) {
      throwErrorPage(pageType, option);
    }
  });
}

function determineYesNoField(uiSchema) {
  let yesNoKey;
  if (uiSchema) {
    for (const key of Object.keys(uiSchema)) {
      if (uiSchema[key]['ui:webComponentField'] === YesNoField) {
        yesNoKey = key;
      }
    }
  }
  return yesNoKey;
}

export function getPageAfterPageKey(pageList, pageKey) {
  let nextPage;
  for (let i = 0; i < pageList.length; i++) {
    if (pageList[i].pageKey === pageKey) {
      nextPage = pageList[i + 1];
    }
  }
  return nextPage;
}

export function validatePages(orderedPageTypes) {
  const pageTypes = {};
  for (const pageType of orderedPageTypes) {
    if (pageType === 'intro') {
      if (pageTypes.intro || pageTypes.summary || pageTypes.item) {
        throw new Error(
          "arrayBuilderPages `pageBuilder.introPage` must be first and defined only once. Intro page should be used for 'required' flow, and should contain only text.",
        );
      }
      pageTypes.intro = true;
    } else if (pageType === 'summary') {
      if (pageTypes.summary || pageTypes.item) {
        throw new Error(
          'arrayBuilderPages `pageBuilder.summaryPage` must be defined only once and be defined before the item pages. This is so the loop cycle, and back and continue buttons will work consistently and appropriately. In a "required" flow, the summary path will be skipped on the first round despite being defined first.',
        );
      }
      pageTypes.summary = true;
    } else if (pageType === 'item') {
      pageTypes.item = true;
    }
  }
  if (!pageTypes.summary) {
    throw new Error(
      'arrayBuilderPages must include a summary page with `pageBuilder.summaryPage`',
    );
  }
  if (!pageTypes.item) {
    throw new Error(
      'arrayBuilderPages must include at least one item page with `pageBuilder.itemPage`',
    );
  }
}

export function validateRequired(required) {
  if (required == null || typeof required === 'string') {
    throwValidateRequired();
  }
}

export function validateReviewPath(reviewPath) {
  if (reviewPath?.charAt(0) === '/') {
    throw new Error('reviewPath should not start with a `/`');
  }
}

export function validateMinItems(minItems) {
  if (minItems != null) {
    // eslint-disable-next-line no-console
    console.warn('minItems is not yet implemented. Use "required" instead.');
  }
}

/**
 * Example:
 * ```
 * pages: {
 *   ...arrayBuilderPages(
 *     {
 *       arrayPath: 'employers',
 *       nounSingular: 'employer',
 *       nounPlural: 'employers',
 *       isItemIncomplete: item => !item?.name,
 *       maxItems: 5,
 *       required: true,
 *       text: {
 *         getItemName: item => item.name,
 *         cardDescription: item => `${item?.dateStart} - ${item?.dateEnd}`,
 *         ...you can override any of the text content
 *       },
 *     },
 *     pageBuilder => ({
 *       mySummaryPage: pageBuilder.summaryPage({
 *         title: 'Employers',
 *         path: 'employers-summary',
 *         uiSchema: ...,
 *         schema: ...,
 *       }),
 *       myItemPageOne: pageBuilder.itemPage({
 *         title: 'Name of employer',
 *         path: 'employers/:index/name',
 *         uiSchema: ...,
 *         schema: ...,
 *       }),
 *       myItemPageTwo: pageBuilder.itemPage({
 *         title: 'Address of employer',
 *         path: 'employers/:index/address',
 *         uiSchema: ...,
 *         schema: ...,
 *       }),
 *     }),
 *   ),
 * },
 * ```
 *
 * - Use `pageBuilder.summaryPage` for the summary page with the yes/no question and the cards
 * - Use `pageBuilder.itemPage` for a page that will be repeated for each item
 *
 * @param {ArrayBuilderOptions} options
 * @param {(pageBuilder: ArrayBuilderPages) => FormConfigChapter} pageBuilderCallback
 * @returns {FormConfigChapter}
 */
export function arrayBuilderPages(options, pageBuilderCallback) {
  let introPath;
  let summaryPath;
  let hasItemsKey;
  const itemPages = [];
  const orderedPageTypes = [];

  if (
    !options ||
    typeof options !== 'object' ||
    !pageBuilderCallback ||
    typeof pageBuilderCallback !== 'function'
  ) {
    throwErrorNoOptionsOrCallbackFunction();
  }

  verifyRequiredArrayBuilderOptions(options, [
    'arrayPath',
    'nounSingular',
    'nounPlural',
    'required',
  ]);

  const {
    arrayPath,
    nounSingular,
    nounPlural,
    getItemName = DEFAULT_ARRAY_BUILDER_TEXT.getItemName,
    isItemIncomplete = item => item?.name,
    minItems = 1,
    maxItems = 100,
    text: userText = {},
    reviewPath = 'review-and-submit',
    required: userRequired,
  } = options;

  const getText = initGetText({
    getItemName,
    nounPlural,
    nounSingular,
    textOverrides: userText,
  });

  /**
   * @type {{
   *   [key: string]: (config: FormConfigPage) => FormConfigPage,
   * }}
   */
  const pageBuilderVerifyAndSetup = {
    introPage: pageConfig => {
      introPath = pageConfig.path;
      orderedPageTypes.push('intro');
      return pageConfig;
    },
    summaryPage: pageConfig => {
      summaryPath = pageConfig.path;
      try {
        hasItemsKey = determineYesNoField(pageConfig.uiSchema);
      } catch (e) {
        throwMissingYesNoField();
      }
      if (!hasItemsKey) {
        throwMissingYesNoField();
      }
      if (!pageConfig.uiSchema?.[hasItemsKey]?.['ui:validations']?.[0]) {
        throwMissingYesNoValidation();
      }
      orderedPageTypes.push('summary');
      return pageConfig;
    },
    itemPage: pageConfig => {
      if (!pageConfig?.path.includes('/:index')) {
        throwIncorrectItemPath();
      }
      itemPages.push(pageConfig);
      orderedPageTypes.push('item');
      return pageConfig;
    },
  };

  // Verify and setup any initial page options
  const testConfig = pageBuilderCallback(pageBuilderVerifyAndSetup);
  validatePages(orderedPageTypes);
  validateRequired(userRequired);
  validateReviewPath(reviewPath);
  validateMinItems(options.minItems);
  const required =
    typeof userRequired === 'function' ? userRequired : () => userRequired;
  const pageKeys = Object.keys(testConfig);
  const firstItemPagePath = itemPages?.[0]?.path;
  const lastItemPagePath = itemPages?.[itemPages.length - 1]?.path;
  const itemLastPageKey = pageKeys?.[pageKeys.length - 1];

  // Didn't throw error so success: Validated and setup success
  const pageBuilder = pageBuilderVerifyAndSetup;

  /** @type {FormConfigPage['onNavForward']} */
  const navForwardFinishedItem = ({ goPath, urlParams, pathname }) => {
    let path = summaryPath;
    if (urlParams?.edit || (urlParams?.add && urlParams?.review)) {
      const index = getArrayIndexFromPathName(pathname);
      const basePath = urlParams?.review ? reviewPath : summaryPath;
      path = createArrayBuilderUpdatedPath({
        basePath,
        index,
        nounSingular,
      });
    }
    goPath(path);
  };

  /** @type {FormConfigPage['onNavBack']} */
  const navBackFirstItem = onNavBackRemoveAddingItem({
    arrayPath,
    introRoute: introPath,
    summaryRoute: summaryPath,
  });

  /** @type {FormConfigPage['onNavForward']} */
  const navForwardSummary = ({ formData, goPath, pageList }) => {
    if (formData[hasItemsKey]) {
      const index = formData[arrayPath] ? formData[arrayPath].length : 0;
      const path = createArrayBuilderItemAddPath({
        path: firstItemPagePath,
        index,
      });
      goPath(path);
    } else {
      const nextPage = getPageAfterPageKey(pageList, itemLastPageKey);
      goPath(nextPage?.path);
    }
  };

  /** @type {FormConfigPage['onNavForward']} */
  const navForwardIntro = ({ formData, goPath, goNextPath }) => {
    // required flow:
    // intro -> items -> summary -> items -> summary
    //
    // optional flow:
    // summary -> items -> summary
    if (required(formData) && !formData[arrayPath]?.length) {
      const path = createArrayBuilderItemAddPath({
        path: firstItemPagePath,
        index: 0,
      });
      goPath(path);
    } else {
      goPath(summaryPath);
    }
  };

  function getNavItem(path) {
    const onNavBack =
      firstItemPagePath === path ? navBackFirstItem : onNavBackKeepUrlParams;
    const onNavForward =
      lastItemPagePath === path
        ? navForwardFinishedItem
        : onNavForwardKeepUrlParams;
    return { onNavBack, onNavForward };
  }

  pageBuilder.introPage = pageConfig => {
    const requiredOpts = ['title', 'path', 'uiSchema', 'schema'];
    verifyRequiredPropsPageConfig('introPage', requiredOpts, pageConfig);

    return {
      onNavForward: navForwardIntro,
      ...pageConfig,
    };
  };

  pageBuilder.summaryPage = pageConfig => {
    const requiredOpts = ['title', 'path', 'uiSchema', 'schema'];
    verifyRequiredPropsPageConfig('summaryPage', requiredOpts, pageConfig);

    const summaryPageProps = {
      arrayPath,
      hasItemsKey,
      firstItemPagePath,
      getText,
      isItemIncomplete,
      maxItems,
      nounPlural,
      nounSingular,
      required,
    };

    return {
      CustomPageReview: ArrayBuilderSummaryPage({
        isReviewPage: true,
        ...summaryPageProps,
      }),
      CustomPage: ArrayBuilderSummaryPage({
        isReviewPage: false,
        ...summaryPageProps,
      }),
      onNavForward: navForwardSummary,
      ...pageConfig,
    };
  };

  pageBuilder.itemPage = pageConfig => {
    const requiredOpts = ['title', 'path', 'uiSchema', 'schema'];
    verifyRequiredPropsPageConfig('itemPage', requiredOpts, pageConfig);
    const { onNavBack, onNavForward } = getNavItem(pageConfig.path);

    return {
      showPagePerItem: true,
      allowPathWithNoItems: true,
      arrayPath,
      CustomPage: ArrayBuilderItemPage({
        arrayPath,
        introRoute: introPath,
        summaryRoute: summaryPath,
        reviewRoute: reviewPath,
        required,
        getText,
      }),
      CustomPageReview: () => null,
      customPageUsesPagePerItemData: true,
      onNavBack,
      onNavForward,
      ...pageConfig,
      uiSchema: {
        [arrayPath]: {
          items: pageConfig.uiSchema,
        },
      },
      schema: {
        type: 'object',
        properties: {
          [arrayPath]: {
            type: 'array',
            minItems,
            maxItems,
            items: pageConfig.schema,
          },
        },
      },
    };
  };

  return pageBuilderCallback(pageBuilder);
}
