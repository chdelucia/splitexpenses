import { Injectable } from '@angular/core';

import { environment } from '@env/environment';

@Injectable({
  providedIn: 'root',
})
export class LoggerService {
  constructor() {}

  info(
    componentName: string,
    functionName: string,
    message: unknown,
    bgColor = '#18864b',
  ) {
    if (!environment.production) {
      // eslint-disable-next-line no-console
      console.log(
        `%c ${componentName} %c ${functionName} `,
        `background: ${bgColor}; color: #fff; border:1px solid #000`,
        'background: #fff; color: #000; border:1px solid #000',
        message,
      );
    }
  }
}
