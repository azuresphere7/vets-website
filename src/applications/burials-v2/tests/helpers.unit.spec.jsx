import { expect } from 'chai';
import sinon from 'sinon';

import {
  mockFetch,
  setFetchJSONResponse as setFetchResponse,
} from 'platform/testing/unit/helpers';
import { submit } from '../utils/helpers.jsx';

describe('Burials helpers', () => {
  describe('submit', () => {
    beforeEach(() => {
      window.VetsGov = { pollTimeout: 1 };
      window.URL = {
        createObjectURL: sinon.stub().returns('test'),
      };
    });
    it('should reject if initial request fails', () => {
      mockFetch(new Error('fake error'), false);
      const formConfig = {
        chapters: {},
      };
      const form = {
        data: {},
      };

      return submit(form, formConfig).then(
        () => {
          expect.fail();
        },
        err => {
          expect(err.message).to.equal('fake error');
        },
      );
    });
    it('should resolve if polling state is success', () => {
      mockFetch();
      setFetchResponse(global.fetch.onFirstCall(), {
        data: {
          attributes: {
            guid: 'test',
          },
        },
      });
      setFetchResponse(global.fetch.onSecondCall(), {
        data: {
          attributes: {
            state: 'pending',
          },
        },
      });
      const response = {};
      setFetchResponse(global.fetch.onThirdCall(), {
        data: {
          attributes: {
            state: 'success',
            response,
          },
        },
      });
      const formConfig = {
        chapters: {},
      };
      const form = {
        data: {},
      };

      return submit(form, formConfig).then(res => {
        expect(res).to.deep.equal(response);
      });
    });
    it('should reject if polling state is failed', () => {
      mockFetch();
      setFetchResponse(global.fetch.onFirstCall(), {
        data: {
          attributes: {
            guid: 'test',
          },
        },
      });
      setFetchResponse(global.fetch.onSecondCall(), {
        data: {
          attributes: {
            state: 'pending',
          },
        },
      });
      setFetchResponse(global.fetch.onThirdCall(), {
        data: {
          attributes: {
            state: 'failed',
          },
        },
      });
      const formConfig = {
        chapters: {},
      };
      const form = {
        data: {},
      };

      return submit(form, formConfig).then(
        () => {
          expect.fail();
        },
        err => {
          expect(err.message).to.equal(
            'vets_server_error_burial: status failed',
          );
        },
      );
    });
    afterEach(() => {
      delete window.URL;
    });
  });
});
