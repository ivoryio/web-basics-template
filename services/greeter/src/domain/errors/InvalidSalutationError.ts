import { AppError } from '../../shared/core/AppError'

export class InvalidSalutationError extends AppError {
  constructor(message: string) {
    super(message)
  }
}
