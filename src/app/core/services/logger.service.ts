import { Injectable } from '@angular/core';

import { Log } from  'ng2-logger/browser';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class LoggerService {
  log = Log.create('');
  constructor() { }

  info(componentName: string, functionName: string, message: unknown, color?: string) {
    this.log['name'] = componentName;
    if (color) {
      this.log.color = color;
    }
    this.log.i(functionName, message);
  }

  error(componentName: string, functionName: string, message: unknown) {
    this.log['name'] = componentName;
    this.log.color = 'red';
    this.log.er(functionName, message);
  }

  propio(name: string, message: unknown) {
    if (environment.production) {
      console.info(name, message)
    }
  }
}
