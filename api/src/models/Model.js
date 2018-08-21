const { merge } = require('lodash');
const { Model: ObjectionModel } = require('objection');


class Model extends ObjectionModel {
  static get combinedJsonSchema() {
    const virtualProperties      = {};
    const relationshipProperties = {};

    // Virtual Attributes
    if (this.virtualAttributes) {
      const virtualAttributes = this.virtualAttributes;

      virtualAttributes.forEach(attribute => {
        virtualProperties[attribute] = { anyOf: [{ type: 'string' }, { type: 'null' }] };
      });
    }

    // Relationships
    if (this.relationMappings) {
      const relationships = this.relationMappings;

      Object.keys(relationships).forEach(attribute => {
        const relationship = relationships[attribute];
        const modelClass   = typeof relationship.modelClass === 'string'
          ? require(`./${relationship.modelClass}`)[relationship.modelClass]
          : relationship.modelClass;

        // Try to avoid loops, don't include "parent" models in childs, i.e. skip Image in ImageComment
        if (this.name.startsWith(modelClass.name)) {
          return;
        }

        if (attribute.endsWith('s')) {

          // HasMany or ManyToMany
          relationshipProperties[attribute] = {
            anyOf: [{ type: 'null' }, { type: 'array', items: modelClass.combinedJsonSchema }],
          };

        }
        else {

          // BelongsToOne
          relationshipProperties[attribute] = {
            anyOf: [{ type: 'null' }, modelClass.combinedJsonSchema],
          };

        }
      });
    }

    return merge(
      {}, this.jsonSchema,
      { properties: virtualProperties }, { properties: relationshipProperties },
    );
  }

  static get modelPaths() {
    return [__dirname];
  }

}


module.exports = { Model };
