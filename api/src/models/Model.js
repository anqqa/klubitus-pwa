const { merge } = require('lodash');
const { Model: ObjectionModel } = require('objection');


class Model extends ObjectionModel {
  static getCombinedJsonSchema(filterRelations) {
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
      const filterClasses = [this.name];

      if (typeof filterRelations === 'string') {
        filterClasses.push(filterRelations);
      }
      else if (filterRelations) {
        filterClasses.push(...filterRelations);
      }

      Object.keys(relationships).forEach(attribute => {
        const relationship = relationships[attribute];
        const modelClass   = typeof relationship.modelClass === 'string'
          ? require(`./${relationship.modelClass}`)[relationship.modelClass]
          : relationship.modelClass;

        if (filterClasses.includes(modelClass.name)) {
          return;
        }

        if (attribute.endsWith('s')) {

          // HasMany or ManyToMany
          relationshipProperties[attribute] = {
            anyOf: [{ type: 'null' }, { type: 'array', items: modelClass.getCombinedJsonSchema(filterClasses) }],
          };

        }
        else {

          // BelongsToOne
          relationshipProperties[attribute] = {
            anyOf: [{ type: 'null' }, modelClass.getCombinedJsonSchema(filterClasses)],
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
