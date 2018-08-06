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
        virtualProperties[attribute] = { type: ['string', 'null'] };
      });
    }

    // Relationships
    if (this.relationMappings) {
      const relationships = this.relationMappings;

      Object.keys(relationships).forEach(attribute => {
        const relationship = relationships[attribute];

        relationshipProperties[attribute] = {
          anyOf: [{ type: 'null' }, relationship.modelClass.combinedJsonSchema],
        };
      });
    }

    return merge(
      {}, this.jsonSchema,
      { properties: virtualProperties }, { properties: relationshipProperties },
    );
  }
}


module.exports = { Model };
