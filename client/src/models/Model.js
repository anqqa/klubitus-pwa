import { Model as BaseModel } from 'vue-api-query';

export default class Model extends BaseModel {
  baseURL() {
    return this.$http.defaults.baseURL.replace(/\/$/, '');
  }

  /**
   * @TODO: Remove after .params() works with SSR in asyncData.
   */
  static params(payload) {
    const self = this.instance();

    self._builder.payload = payload;

    return self;
  }

  request(config) {
    return this.$http.request(config);
  }
}
