import React from 'react';
import { titleUI } from 'platform/forms-system/src/js/web-component-patterns';
import { applicantWording } from '../../../shared/utilities';
import ApplicantField from '../../../shared/components/applicantLists/ApplicantField';
import { fileUploadUi as fileUploadUI } from '../../../shared/components/fileUploads/upload';
import { requiredFiles } from '../../config/requiredUploads';
import {
  uploadWithInfoComponent,
  // acceptableFiles,
  mailOrFaxLaterMsg,
} from '../Sponsor/sponsorFileUploads';

// This file contains the ui/schemas for applicant file upload screens.

/**
 * Provide a string indicating if a file contained in a form page is in the
 * requiredFiles object
 * @param {object} formContext formContext object from a list loop page
 * @returns a string, either '(Required)' or '(Optional)' depending on if the
 * formContext contained one or more properties that intersect with the
 * requiredFiles object
 */
function isRequiredFile(formContext) {
  return Object.keys(formContext?.schema?.properties || {}).filter(v =>
    Object.keys(requiredFiles).includes(v),
  ).length >= 1
    ? '(Required)'
    : '(Optional)';
}

export const marriageDocumentList = (
  <>
    Upload a copy of one of these documents:
    <ul>
      <li>
        Marriage certificate, <b>or</b>
      </li>
      <li>
        A document showing proof of a civil union, <b>or</b>
      </li>
      <li>Common-law marriage affidavit</li>
    </ul>
  </>
);

export const applicantBirthCertConfig = uploadWithInfoComponent(
  undefined, // acceptableFiles.birthCert,
  'birth certificates',
  false,
);

export const applicantBirthCertUploadUiSchema = {
  applicants: {
    'ui:options': { viewField: ApplicantField },
    items: {
      ...titleUI(
        ({ _formData, formContext }) =>
          `Upload birth certificate ${isRequiredFile(formContext)}`,
        ({ formData, formContext }) => (
          <>
            To help us process this application faster, submit a copy of{' '}
            <b>
              {applicantWording(
                formData,
                undefined,
                true,
                false,
                formContext.pagePerItemIndex,
              )}
            </b>{' '}
            birth certificate.
            <br />
            Submitting a copy can help us process this application faster.
            <br />
            {mailOrFaxLaterMsg}
          </>
        ),
      ),
      ...applicantBirthCertConfig.uiSchema,
      applicantBirthCertOrSocialSecCard: fileUploadUI({
        label: 'Upload a copy of birth certificate',
      }),
    },
  },
};

export const applicantSchoolCertConfig = uploadWithInfoComponent(
  undefined, // acceptableFiles.schoolCert,
  'school certifications',
  false,
);

export const applicantSchoolCertUploadUiSchema = {
  applicants: {
    'ui:options': { viewField: ApplicantField },
    items: {
      ...titleUI(
        ({ _formData, formContext }) =>
          `Upload proof of school enrollment ${isRequiredFile(formContext)}`,
        ({ formData, formContext }) => {
          const posessive = applicantWording(
            formData,
            undefined,
            true,
            false,
            formContext.pagePerItemIndex,
          );
          const nonPosessive = applicantWording(
            formData,
            undefined,
            false,
            false,
            formContext.pagePerItemIndex,
          );
          return (
            <>
              You’ll need to submit a copy of a document showing proof of{' '}
              <b>{posessive}</b> school enrollment. If{' '}
              <b>{nonPosessive === 'you' ? 'you’re' : posessive}</b> planning to
              enroll,{' '}
              <b>
                {nonPosessive === 'you' ? 'you’ll' : `${nonPosessive} will`}
              </b>{' '}
              need to upload a document showing information about{' '}
              <b>{posessive}</b> plan to enroll.
              <br />
              <br />
              {mailOrFaxLaterMsg}
              <br />
              <br />
              Fill out a School Enrollment Certification Form.
              <br />
              <a
                target="_blank"
                rel="noreferrer noopener"
                href="https://www.va.gov/COMMUNITYCARE/pubs/FormDetails_CHAMPVA_School_Cert.asp"
              >
                Get school enrollment certification form to download (opens in
                new tab)
              </a>
              <br />
              <br />
              Or you can submit an enrollment letter on the school’s letterhead.
              <br />
              Here’s what the letter should include:
              <ul>
                <li>{posessive} first and last name</li>
                <li>The last 4 digits of {posessive} Social Security number</li>
                <li>
                  The start and end dates for each semester or enrollment term
                </li>
                <li>
                  Signature and title of a school official (like a director or
                  principal)
                </li>
              </ul>
              If {nonPosessive === 'you' ? 'you’re' : `${nonPosessive} is`} not
              enrolled, upload a copy of {posessive} acceptance letter from the
              school.
            </>
          );
        },
      ),
      ...applicantSchoolCertConfig.uiSchema,
      applicantSchoolCert: fileUploadUI({
        label: 'Upload proof of school enrollment',
      }),
    },
  },
};

export const applicantHelplessChildConfig = uploadWithInfoComponent(
  undefined, // acceptableFiles.helplessCert,
  'VBA decision rating',
  false,
);

export const applicantHelplessChildUploadUiSchema = {
  applicants: {
    'ui:options': { viewField: ApplicantField },
    items: {
      ...titleUI(
        ({ _formData, formContext }) =>
          `Upload rating decision letter ${isRequiredFile(formContext)}`,
        ({ formData, formContext }) => {
          const posessive = applicantWording(
            formData,
            undefined,
            true,
            false,
            formContext.pagePerItemIndex,
          );
          return (
            <>
              You’ve selected that <b>{posessive}</b> permanently incapable of
              self support and rated as a helpless child.
              <br />
              <br />
              To help us process this application faster, you can submit a copy
              of a document showing proof of <b>{posessive}</b> rating.
              <br />
              <br />
              {mailOrFaxLaterMsg}
            </>
          );
        },
      ),
      ...applicantHelplessChildConfig.uiSchema,
      applicantHelplessCert: fileUploadUI({
        label: 'Upload rating decision letter',
      }),
    },
  },
};

export const applicantAdoptedConfig = uploadWithInfoComponent(
  undefined, // acceptableFiles.adoptionCert,
  'adoption papers',
  false,
);

export const applicantAdoptedUploadUiSchema = {
  applicants: {
    'ui:options': { viewField: ApplicantField },
    items: {
      ...titleUI(
        ({ _formData, formContext }) =>
          `Upload proof of adoption ${isRequiredFile(formContext)}`,
        ({ formData, formContext }) => (
          <>
            You’ll need to submit a document showing proof of{' '}
            <b>
              {applicantWording(
                formData,
                undefined,
                true,
                false,
                formContext.pagePerItemIndex,
              )}{' '}
            </b>
            adoption (like court ordered adoption papers).
            <br />
            {mailOrFaxLaterMsg}
          </>
        ),
      ),
      ...applicantAdoptedConfig.uiSchema,
      applicantAdoptionPapers: fileUploadUI({
        label: 'Upload proof of adoption',
      }),
    },
  },
};

export const applicantStepChildConfig = uploadWithInfoComponent(
  undefined, // acceptableFiles.stepCert,
  'marriage certificates',
  false,
);

export const applicantStepChildUploadUiSchema = {
  applicants: {
    'ui:options': { viewField: ApplicantField },
    items: {
      ...titleUI(
        ({ _formData, formContext }) =>
          `Upload proof of marriage or legal union ${isRequiredFile(
            formContext,
          )}`,
        ({ formData, formContext }) => {
          const posessive = applicantWording(
            formData,
            undefined,
            true,
            false,
            formContext.pagePerItemIndex,
          );
          return (
            <>
              You’ll need to submit a document showing proof of the marriage or
              legal union between <b>{posessive}</b> sponsor and{' '}
              <b>{posessive}</b> parent.
              <br />
              <br />
              {marriageDocumentList}
              {mailOrFaxLaterMsg}
            </>
          );
        },
      ),
      ...applicantStepChildConfig.uiSchema,
      applicantStepMarriageCert: fileUploadUI({
        label: 'Upload proof of marriage or legal union',
      }),
    },
  },
};

export const applicantMedicarePartAPartBCardsConfig = uploadWithInfoComponent(
  undefined, // acceptableFiles.medicareABCert,
  'copy of Medicare Parts A or B card',
  false,
);

export const applicantMedicarePartAPartBCardsUploadUiSchema = {
  applicants: {
    'ui:options': { viewField: ApplicantField },
    items: {
      ...titleUI(
        ({ _formData, formContext }) =>
          `Upload Medicare cards ${isRequiredFile(formContext)}`,
        ({ formData, formContext }) => {
          const posessive = applicantWording(
            formData,
            undefined,
            true,
            false,
            formContext.pagePerItemIndex,
          );
          return (
            <>
              You’ll need to submit a copy of the front and back of{' '}
              <b>{posessive}</b> Medicare Part A and B cards.
              <br />
              {mailOrFaxLaterMsg}
            </>
          );
        },
      ),
      ...applicantMedicarePartAPartBCardsConfig.uiSchema,
      applicantMedicarePartAPartBCard: fileUploadUI({
        label: 'Upload Medicare cards',
      }),
    },
  },
};

export const applicantMedicarePartDCardsConfig = uploadWithInfoComponent(
  undefined, // acceptableFiles.medicareDCert,
  'copy of Medicare Part D card',
  false,
);

export const applicantMedicarePartDCardsUploadUiSchema = {
  applicants: {
    'ui:options': { viewField: ApplicantField },
    items: {
      ...titleUI(
        ({ _formData, formContext }) =>
          `Upload Medicare card ${isRequiredFile(formContext)}`,
        ({ formData, formContext }) => {
          const posessive = applicantWording(
            formData,
            undefined,
            true,
            false,
            formContext.pagePerItemIndex,
          );
          return (
            <>
              You’ll need to submit a copy of the front and back of{' '}
              <b>{posessive}</b> Medicare Part D card.
              <br />
              {mailOrFaxLaterMsg}
            </>
          );
        },
      ),
      ...applicantMedicarePartDCardsConfig.uiSchema,
      applicantMedicarePartDCard: fileUploadUI({
        label: 'Upload Medicare card',
      }),
    },
  },
};

export const appMedicareOver65IneligibleConfig = uploadWithInfoComponent(
  undefined, // acceptableFiles.ssIneligible,
  'Medicare ineligibility proof',
  false,
);

export const appMedicareOver65IneligibleUploadUiSchema = {
  applicants: {
    'ui:options': { viewField: ApplicantField },
    items: {
      ...titleUI(
        ({ _formData, formContext }) =>
          `Upload proof of Medicare ineligibility ${isRequiredFile(
            formContext,
          )}`,
        ({ formData, formContext }) => {
          const nonPosessive = applicantWording(
            formData,
            undefined,
            false,
            true,
            formContext.pagePerItemIndex,
          );
          return (
            <>
              <b>{nonPosessive === 'You' ? 'You’re' : `${nonPosessive} is`}</b>{' '}
              65 years or older and you selected that{' '}
              <b>{nonPosessive === 'You' ? 'you’re' : 'they’re'}</b> not
              eligible for Medicare.
              <br />
              <br />
              You’ll need to submit a copy of a letter from the Social Security
              Administration that confirms that{' '}
              <b>{nonPosessive === 'You' ? 'you' : 'they'}</b> don’t qualify for
              Medicare benefits under anyone’s Social Security number.
              {mailOrFaxLaterMsg}
            </>
          );
        },
      ),
      ...appMedicareOver65IneligibleConfig.uiSchema,
      applicantMedicareIneligibleProof: fileUploadUI({
        label: 'Upload proof of Medicare ineligibility',
      }),
    },
  },
};

export const applicantOhiCardsConfig = uploadWithInfoComponent(
  undefined, // acceptableFiles.healthInsCert,
  'copy of other health insurance card',
  false,
);

export const applicantOhiCardsUploadUiSchema = {
  applicants: {
    'ui:options': { viewField: ApplicantField },
    items: {
      ...titleUI(
        ({ _formData, formContext }) =>
          `Upload other health insurance cards ${isRequiredFile(formContext)}`,
        <>
          You’ll need to submit a copy of the front and back of all other health
          insurance cards.
          <br />
          <br />
          {mailOrFaxLaterMsg}
        </>,
      ),
      ...applicantOhiCardsConfig.uiSchema,
      applicantOhiCard: fileUploadUI({
        label: 'Upload other health insurance cards',
      }),
    },
  },
};

// TODO: rename so the makeHumanReadable Func works
export const applicantOtherInsuranceCertificationConfig = uploadWithInfoComponent(
  undefined, // acceptableFiles.va7959cCert,
  'VA Form 10-7959c',
  false,
);

export const applicantOtherInsuranceCertificationUploadUiSchema = {
  applicants: {
    'ui:options': { viewField: ApplicantField },
    items: {
      ...titleUI(
        ({ _formData, formContext }) =>
          `Upload Other Insurance Certification ${isRequiredFile(formContext)}`,
        () => (
          <>
            You’ll also need to submit a completed Other Insurance Certification
            (VA Form 10-7959C)
            <br />
            <a
              target="_blank"
              rel="noreferrer noopener"
              href="https://www.va.gov/find-forms/about-form-10-7959c/"
            >
              Get VA Form 10-7959C to download (opens in new tab)
            </a>
            <br />
            <br />
            {mailOrFaxLaterMsg}
          </>
        ),
      ),
      ...applicantOtherInsuranceCertificationConfig.uiSchema,
      applicantOtherInsuranceCertification: fileUploadUI({
        label: 'Upload Other Insurance Certification',
      }),
    },
  },
};

export const applicantMarriageCertConfig = uploadWithInfoComponent(
  undefined, // acceptableFiles.spouseCert,
  'marriage certificates',
  true,
);

export const applicantMarriageCertUploadUiSchema = {
  applicants: {
    'ui:options': { viewField: ApplicantField },
    items: {
      ...titleUI(
        ({ _formData, formContext }) =>
          `Upload proof of marriage or legal union ${isRequiredFile(
            formContext,
          )}`,
        ({ formData, formContext }) => {
          const nonPosessive = applicantWording(
            formData,
            undefined,
            false,
            false,
            formContext.pagePerItemIndex,
          );
          return (
            <>
              You’ll need to submit a document showing proof of the marriage or
              legal union between <b>{nonPosessive}</b> sponsor and{' '}
              <b>
                {formData.veteransFullName?.first}{' '}
                {formData.veteransFullName?.last}.
              </b>
              <br />
              <br />
              {marriageDocumentList}
              {mailOrFaxLaterMsg}
            </>
          );
        },
      ),
      ...applicantMarriageCertConfig.uiSchema,
      applicantMarriageCert: fileUploadUI({
        label: 'Upload proof of marriage or legal union',
      }),
    },
  },
};

export const applicantSecondMarriageCertUploadUiSchema = {
  applicants: {
    'ui:options': { viewField: ApplicantField },
    items: {
      ...titleUI(
        ({ _formData, formContext }) =>
          `Upload proof of marriage or legal union ${isRequiredFile(
            formContext,
          )}`,
        ({ formData, formContext }) => {
          const nonPosessive = applicantWording(
            formData,
            undefined,
            false,
            false,
            formContext.pagePerItemIndex,
          );
          return (
            <>
              You’ll need to submit a document showing proof of the marriage or
              legal union between <b>{nonPosessive}</b> and their current spouse
              or partner
              <br />
              <br />
              {marriageDocumentList}
              {mailOrFaxLaterMsg}
            </>
          );
        },
      ),
      ...applicantMarriageCertConfig.uiSchema,
      applicantSecondMarriageCert: fileUploadUI({
        label: 'Upload proof of marriage or legal union',
      }),
    },
  },
};

export const applicantSecondMarriageDivorceCertConfig = uploadWithInfoComponent(
  undefined, // acceptableFiles.divorceCert,
  'marriage certificates',
  true,
);

export const applicantSecondMarriageDivorceCertUploadUiSchema = {
  applicants: {
    'ui:options': { viewField: ApplicantField },
    items: {
      ...titleUI(
        ({ _formData, formContext }) =>
          `Upload proof of legal separation ${isRequiredFile(formContext)}`,
        ({ formData, formContext }) => {
          const nonPosessive = applicantWording(
            formData,
            undefined,
            false,
            false,
            formContext.pagePerItemIndex,
          );
          return (
            <>
              To help us process this application faster, you can submit a
              document showing proof of legal separation between{' '}
              <b>{nonPosessive}</b> and the sponsor.
              <br />
              <br />
              Upload a copy of one of these documents:
              <ul>
                <li>
                  Divorce decree, <b>or</b>
                </li>
                <li>
                  Annulment decree
                  <b>or</b>
                </li>
              </ul>
              {mailOrFaxLaterMsg}
            </>
          );
        },
      ),
      ...applicantSecondMarriageDivorceCertConfig.uiSchema,
      applicantSecondMarriageDivorceCert: fileUploadUI({
        label: 'Upload proof of legal separation',
      }),
    },
  },
};
