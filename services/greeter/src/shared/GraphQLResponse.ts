import { AppError } from './core/AppError'
import { InvalidSalutationError } from '../domain/errors/InvalidSalutationError'

export class GraphQLResponse {
  public static success(data?: any) {
    return {
      data: data || {},
      error: null,
      success: true
    }
  }

  public static failure(error: AppError) {
    console.log('GRAPHQL RESPONSE', error)
    switch (error.constructor) {
      case InvalidSalutationError: {
        return {
          success: false,
          data: null,
          error: {
            code: InvalidSalutationError,
            message: error.message
          }
        }
      }
      default: {
        return {
          success: false,
          data: null,
          error: {
            code: 'UnkownServiceError',
            message: error.message
          }
        }
      }
    }
  }

  public static fatalFailure(error: Error) {
    console.log(error)
    return {
      success: false,
      data: null,
      error: {
        code: 'InternalServiceError',
        message: error.message
      }
    } 
  }
}
