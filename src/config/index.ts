export const APP_VERSION = '1.0.0';
export const IS_DEBUG = process.env.REACT_APP_DEBUG;
export const HOST = process.env.REACT_APP_API_HOST;
export const GQL_HOST = process.env.REACT_APP_GQL_HOST;
export const LEGACY_HOST = process.env.REACT_APP_API_HOST_LEGACY + 'api';
export const WSHOST = process.env.REACT_APP_API_WS_HOST;
export const WITH_CRED = process.env.REACT_APP_API_WITH_CRED;

export const DEFAULT_LANGUAGE = 'ru';

export const UNAUTH_MAIN_PAGE = '/auth/login';
export const PRIVATE_MAIN_PAGE = '/dashboard/home';
export const UNAUTH_PATHS = ['/auth/login', '/auth/register'];
export const PRIVATE_PATHS = [
  '/profile',
  '/dashboard',
  '/dashboard/scripts/list',
  '/dashboard/schema',
];

export const HTTP_HOST = '';

export const endpoints = {
  v2: {
    graphql: `${GQL_HOST}`,
  },
  devices: {
    list: `${HTTP_HOST}/devices`,
    getById: (uuid: string) => `${HTTP_HOST}/devices/${uuid}`,
    create: `${HTTP_HOST}/devices/`,
    delete: `${HTTP_HOST}/devices/`,
  },
  script: {
    list: `${HTTP_HOST}/script`,
    getById: (id: string) => `${HTTP_HOST}/script/${id}`,
    create: `${HTTP_HOST}/script`,
    delete: (uuid: string) => `${HTTP_HOST}/script/${uuid}`,
  },
};
