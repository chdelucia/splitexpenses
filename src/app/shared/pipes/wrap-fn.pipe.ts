import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'wrapFn',
})
export class WrapFnPipe implements PipeTransform {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  transform<R, F extends (...args: any[]) => R>(
    func: F,
    ...args: Parameters<F>
  ): R {
    return func(...args);
  }
}
