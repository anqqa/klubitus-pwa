const { isEmpty } = require('lodash');

const { Model } = require('./Model');


class Image extends Model {

  static get tableName() {
    return 'images';
  }


  static get jsonSchema() {
    return {
      type: 'object',

      properties: {
        author_id:     { anyOf: [{ type: 'integer' }, { type: 'null' }] },
        comment_count: { type: 'integer' },
        color:         { anyOf: [{ type: 'string' }, { type: 'null' }]},
        created_at:    { type: 'string', description: 'DateTime string' },
        description:   { anyOf: [{ type: 'string' }, { type: 'null' }] },
        exif:          { anyOf: [{ type: 'string' }, { type: 'object', additionalProperties: true }] },
        height:        { anyOf: [{ type: 'integer' }, { type: 'null' }] },
        labels:        { anyOf: [
          { type: 'null' },
          { type: 'array', items: { type: 'object', additionalProperties: true } }
        ] },
        mime_type:     { anyOf: [{ type: 'string' }, { type: 'null' }] },
        id:            { type: 'integer' },
        path:          { anyOf: [{ type: 'string' }, { type: 'null' }] },
        postfix:       { anyOf: [{ type: 'string' }, { type: 'null' }] },
        uuid:          { anyOf: [{ type: 'string' }, { type: 'null' }] },
        view_count:    { type: 'integer' },
        width:         { anyOf: [{ type: 'integer' }, { type: 'null' }] },
      },
    };
  }


  static get virtualAttributes() {
    return ['tags', 'url'];
  }


  static get relationMappings() {
    return {
      author: {
        relation:   Model.BelongsToOneRelation,
        modelClass: 'User',
        join:       { from: 'images.author_id', to: 'users.id' },
      },

      comments: {
        relation:   Model.HasManyRelation,
        modelClass: 'ImageComment',
        join:       { from: 'images.id', to: 'image_comments.image_id' },
      },

      // exif: {
      //   relation:   Model.BelongsToOneRelation,
      //   modelClass: 'ImageExif',
      //   join:       { from: 'images.id', to: 'exifs.image_id' },
      // },

      notes: {
        relation:   Model.HasManyRelation,
        modelClass: 'ImageNote',
        join:       { from: 'images.id', to: 'image_notes.image_id' },
      },
    };
  }


  tags() {
    if (!this.labels) {
      return [];
    }

    const parsed = this.labels.map(label => ({
      name:       label.Name,
      confidence: Math.round(label.Confidence * 100 + Number.EPSILON) / 100,
      parents:    label.Parents.map(parent => parent.Name),
    }));

    const unflatten = (tags, parent, tree) => {
      tree = typeof tree !== 'undefined' ? tree : [];

      const children = tags
        .filter(tag => {
          const isRoot  = !parent && !tag.parents.length;
          const isChild = parent && tag.parents.includes(parent.name);

          return isRoot || isChild;
        })
        .map(child => {
          const { parents, ...parentless } = child;

          return parentless;
        });

      if (!isEmpty(children)) {
        if (!parent) {
          tree = children;
        }
        else {
          parent['children'] = children;
        }

        children.map(child => unflatten(tags, child));
      }

      return tree;
    };

    return unflatten(parsed);
  }


  url() {

    // AWS S3 URL
    if (this.path) {
      return `https://${process.env.AWS_BUCKET}/${this.path}`;
    }

    // Convert numeric id to path, e.g. 1234567 -> 01/23/45
    const hex    = this.id.toString(16).padStart(8, '0');
    const chunks = hex.match(/.{1,2}/g);
    chunks.pop();

    return `https://images.klubitus.org/${chunks.join('/')}/${this.id}_${this.postfix}.jpg`;
  }

}


module.exports = { Image };
