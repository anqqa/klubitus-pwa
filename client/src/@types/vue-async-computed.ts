// tslint:disable:interface-name
// tslint:disable:max-classes-per-file
import Vue, { PluginFunction } from 'vue';
import { IAsyncComputedProperties } from 'vue-async-computed';

declare module 'vue-async-computed' {
  interface IAsyncComputedOptions {
    errorHandler?: (error: string[]) => void;
    useRawError?: boolean;
    default?: any;
  }

  export default class AsyncComputed {
    public static install: PluginFunction<never>;
    public static version: string;

    constructor(options?: IAsyncComputedOptions);
  }

  type AsyncComputedGetter<T> = () => Promise<T> | T;
  export interface IAsyncComputedProperty<T> {
    default?: T | (() => T);
    get?: AsyncComputedGetter<T>;
    watch?: () => void;
    shouldUpdate?: () => boolean;
    lazy?: boolean;
  }

  export interface IAsyncComputedProperties {
    [K: string]: AsyncComputedGetter<any> | IAsyncComputedProperty<any>;
  }
}

declare module 'vue/types/options' {
  interface ComponentOptions<V extends Vue> {
    asyncComputed?: IAsyncComputedProperties;
  }
}

interface IASyncComputedState {
  state: 'updating' | 'success' | 'error';
  updating: boolean;
  success: boolean;
  error: boolean;
  exception: Error | null;
  update: () => void;
}

declare module 'vue/types/vue' {
  interface Vue {
    $asyncComputed: { [K: string]: IASyncComputedState };
  }
}
