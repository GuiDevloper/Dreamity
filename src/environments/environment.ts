// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  firebase: {
    apiKey: 'AIzaSyANkI6GPvW5nwFDrQ2lOnGhQE-orW5CPLE',
    authDomain: 'dreamity-48d05.firebaseapp.com',
    databaseURL: 'https://dreamity-48d05.firebaseio.com',
    projectId: 'dreamity-48d05',
    storageBucket: 'dreamity-48d05.appspot.com',
    messagingSenderId: '353861806219'
  }
};

/*
 * In development mode, to ignore zone related error stack frames such as
 * `zone.run`, `zoneDelegate.invokeTask` for easier debugging, you can
 * import the following file, but please comment it out in production mode
 * because it will have performance impact when throw error
 */
import 'zone.js/dist/zone-error';  // Included with Angular CLI.
