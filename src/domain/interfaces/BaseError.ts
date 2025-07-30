export type ErrorTypes =
  | "entity_already_exists"
  | "entity_not_found"
  | "permission_denied"
  | "internal"
  | "invalid_argument"
  | "unauthenticated"
  | "unavailable"
  | "unimplemented"

export default abstract class BaseError extends Error {
  public readonly errorType: ErrorTypes
  public readonly details: string

  constructor(error: string, name: string, errorType: ErrorTypes, details: string) {
    super(error)
    this.name = name
    this.errorType = errorType
    this.details = details
  }
}
