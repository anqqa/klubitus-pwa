export class EntityForbiddenError extends Error {
  name = 'EntityForbidden';

  constructor(entityClass: any) {
    super();

    Object.setPrototypeOf(this, EntityForbiddenError.prototype);

    let targetName: string;
    if (typeof entityClass === 'object') {
      targetName = entityClass.constructor.name;
    } else if (typeof entityClass === 'function') {
      targetName = entityClass.name;
    } else {
      targetName = entityClass as string;
    }

    this.message = `${targetName} not accessible`;
  }
}
