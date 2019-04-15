import { Model as BaseModel } from 'vue-api-query';

export default class Model extends BaseModel {
  find(identifier) {
    if (identifier === undefined) {
      throw new Error('You must specify the param on find() method.');
    }

    let base = this._fromResource || `${this.baseURL()}/${this.resource()}`;
    let url = `${base}/${identifier}${this._builder.query()}`;

    return this.request({
      url,
      method: 'GET',
    }).then(response => new this.constructor(response.data.data || response.data));
  }

  baseURL() {
    console.log(this.$http);
    return this.$http.defaults.baseURL.replace(/\/$/, '');
  }

  request(config) {
    console.log(config);
    return this.$http.request(config);
  }
}
