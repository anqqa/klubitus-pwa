import { Model as BaseModel } from 'vue-api-query';

export class Model extends BaseModel {
  public baseURL(): string {
    return Model.$http.defaults.baseURL!.replace(/\/$/, '');
  }

  /**
   * @TODO: Remove after .params() works with SSR in asyncData.
   */
  public params(payload: Record<string, any>) {
    const self = Model.instance();

    self._builder.payload = payload;

    return self;
  }

  public request(config): Promise<any> {
    return Model.$http.request(config);
  }
}

export default Model;
