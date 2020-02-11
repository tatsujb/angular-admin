import { EnvEnum } from 'src/app/services/entities/env.enum';

export const environment = {
  production: false,
};

// Export config const
export const ENV: EnvEnum = EnvEnum.VAL;
export const API_URL = 'https://collaboration-v.airbus-v.corp/manage/';
export const AUTH_URL = 'https://collaboration-v.airbus-v.corp/manage/provisioning/sso/token.php?application=ADMIN&redirectUri=';
export const BASE_URL = '/';
export const UPLOADS_URL = 'https://collaboration-v.airbus-v.corp/manage/provisioning';
export const GLOBALFILTER = encodeURI(
  JSON.stringify({
    column: null,
    data: null,
    pageFilter: null,
    mwf: null,
    cause: null,
  })
);
export const LOADOPTIONS: string = encodeURI(
  JSON.stringify({
    sort: null,
    requireTotalCount: true,
    searchOperation: 'contains',
    searchValue: null,
    userData: {},
    totalSummary: [
      {
        selector: 'mail',
        summaryType: 'count',
      },
      {
        selector: 'mail',
        summaryType: 'min',
      },
    ],
  })
);

// Use Mock in all application
export const USE_MOCK = false;
export const HOMEPAGE_URL = ``;
