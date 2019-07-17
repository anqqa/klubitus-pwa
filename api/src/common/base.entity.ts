export class BaseEntity {
  public can(doAction: string, withRoles?: string[]): boolean {
    return true;
  }
}
