import { ErrorTypes } from '../../domain/interfaces/BaseError'

export const mapErrorCodes = (errorType: ErrorTypes): number => {
  switch (errorType) {
    case 'entity_already_exists':
    case 'invalid_argument':
    case 'unavailable':
    case 'unimplemented':
      return 400

    case 'entity_not_found':
      return 404

    case 'permission_denied':
    case 'unauthenticated':
      return 403

    default:
      return 500
  }
}
