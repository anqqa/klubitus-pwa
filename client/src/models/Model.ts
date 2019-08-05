import { Model as BaseModel } from 'vue-api-query';

export class Model extends BaseModel {
  /**
   * @TODO: Remove after .params() works with SSR in asyncData.
   */
  public static params(payload: Record<string, any>) {
    const self = this.instance();

    self._builder.payload = payload;

    return self;
  }

  public baseURL(): string {
    return Model.$http.defaults.baseURL!.replace(/\/$/, '');
  }

  public request(config): Promise<any> {
    return Model.$http.request(config);
  }
}

export default Model;
