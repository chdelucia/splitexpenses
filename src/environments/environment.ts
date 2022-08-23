// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  localStorageWeather: 'Wheater',
  localStorageExpenses: 'Expenses',
  localStorageUsers: 'Users',
  expensesTypes: ['Hobbies', 'Meals','Transport', 'Drinks', 'Culture',
  'Accommodation','Souvenirs',  'Other'],
  baseUrl: 'https://api.openweathermap.org/data/2.5/',
  appId: '2fb85354f6d2ae8c0880bd93c1e20120',
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
