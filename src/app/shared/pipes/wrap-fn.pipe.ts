import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'wrapFn',
})
export class WrapFnPipe implements PipeTransform {
  transform<R, F extends (...args: any[]) => R>(
    func: F,
    ...args: Parameters<F>
  ): R {
    return func(...args);
  }
}
