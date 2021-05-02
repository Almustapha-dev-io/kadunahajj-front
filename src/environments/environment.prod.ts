const endpoint = 'https://kaduna-hajj-app-api.herokuapp.com';

export const environment = {
  production: true,
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
