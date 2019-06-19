import { IAsyncComputedProperty } from 'vue-async-computed';
import { createDecorator, VueDecorator } from 'vue-class-component';

export function AsyncComputed<T>(computedOptions?: IAsyncComputedProperty<T>): VueDecorator {
  return createDecorator((options, key) => {
    options.asyncComputed = options.asyncComputed || {};

    const get = options.methods![key];
    options.asyncComputed[key] = { get, ...computedOptions } as IAsyncComputedProperty<T>;

    delete options.methods![key];
  });
}
