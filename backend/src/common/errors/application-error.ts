export enum ApplicationErrorStatus {
  Unauthorized = 401,
  NotFound = 404,
  Conflict = 409,
}

export class ApplicationError extends Error {
  constructor(
    public readonly statusCode: ApplicationErrorStatus,
    public readonly messageKey: string,
    public readonly fallback: string,
  ) {
    super(fallback);
    this.name = ApplicationError.name;
  }
}
