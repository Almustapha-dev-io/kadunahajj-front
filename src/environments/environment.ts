// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
// const endpoint = 'https://kaduna-hajj-app-api.herokuapp.com';
// const endpoint = 'http://localhost:3000';
const endpoint = 'https://kaduna-hajj-app-api.herokuapp.com';

export const environment = {
  production: false,
  auth: `${endpoint}/api/auths`,
  roles: `${endpoint}/api/roles`,
  users: `${endpoint}/api/users`,
  zones: `${endpoint}/api/enrollment-zones`,
  years: `${endpoint}/api/years`,
  banks: `${endpoint}/api/banks`,
  states: `${endpoint}/api/states`,
  lgas: `${endpoint}/api/local-govs`,
  pilgrims: `${endpoint}/api/pilgrims`,
  seats: `${endpoint}/api/seats`,
  analytics: `${endpoint}/api/analytics`,

  emailPattern: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
