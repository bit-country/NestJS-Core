export type GenericFunction = (...args: any[]) => any;
export type GenericClass = Record<string, any>;

export const AUTH_SERVICE = 'auth';
export const PAYMENTS_SERVICE = 'payments';
export const NOTIFICATIONS_SERVICE = 'notifications';
export const API_SECURITY_SCHEME = 'API-Gateway-User-Pool-Authorizer';

export enum ENV {
  DEVELOPMENT = 'development',
  TEST = 'test',
  STAGING = 'staging',
  PRODUCTION = 'production',
}
