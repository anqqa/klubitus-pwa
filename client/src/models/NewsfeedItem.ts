import Model from './Model';

export default class NewsfeedItem extends Model {
  resource() {
    return 'newsfeed';
  }

  /**
   * Newsfeed items are returned as list of list of items.
   */
  get() {
    let base = this._fromResource || `${this.baseURL()}/${this.resource()}`;
    base = this._customResource ? `${this.baseURL()}/${this._customResource}` : base;
    const url = `${base}${this._builder.query()}`;

    const parser = data => {
      const item = new NewsfeedItem(data);

      Object.defineProperty(item, '_fromResource', { get: () => this._fromResource });

      return item;
    };

    return this.request({ url, method: 'GET' }).then(response => {
      let collection = response.data.data || response.data;
      collection = Array.isArray(collection) ? collection : [collection];

      collection = collection.map(c => {
        const subCollection = Array.isArray(c) ? c : [c];

        return subCollection.map(parser);
      });

      if (response.data.data !== undefined) {
        response.data.data = collection;
      } else {
        response.data = collection;
      }

      return response.data;
    });
  }
}
