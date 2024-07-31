export class User {
  constructor(
    public id: number,
    public email: string,
    public name: string,
    public jobTitle: string,

    public roles?: string[],
    public token?: string,
    public group?: any,
    public sourceSubsidiaryName?: any,
    public grantedAccessBu?: any,
    public hasHubAccess?: boolean
  ) {}
}
