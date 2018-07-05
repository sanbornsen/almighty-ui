import { OpaqueToken } from '@angular/core';
import { AUTH_API_URL } from 'ngx-login-client';

let authApiUrlFactory = () => {
  console.log('Using AUTH URL : ' + process.env.FABRIC8_AUTH_API_URL);
  return process.env.FABRIC8_AUTH_API_URL;
};

export const authApiUrlProvider = {
  provide: AUTH_API_URL,
  useFactory: authApiUrlFactory
};
