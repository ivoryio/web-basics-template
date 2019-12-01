import { GraphQLResponse } from '../../../shared/GraphQLResponse'
import { SalutationRepository } from '../../../persistance/SalutationRepository'
import { ISalutationRepository } from '../../../persistance/contracts'
import { GetRandomGreeting } from '../../../domain/usecases/GetRandomGreeting'

export default class GreetingController {
  public static readonly salutationRepository: ISalutationRepository = new SalutationRepository()

  public static async resolve(operation: string, identity: any, input: any) {
    switch (operation) {
      case 'getRandomGreeting': {
        const result = await this.resolveGetRandomGreeting(identity)

        if (result.isSuccess) {
          return GraphQLResponse.success({
            message: result.getValue()
          })
        } else {
          return GraphQLResponse.failure(result.getErrorValue()!)
        }
      }
      default: {
        return null
      }
    }
  }

  private static async resolveGetRandomGreeting(identity: any) {
    const username = 'John Doe'
    const uc = new GetRandomGreeting(GreetingController.salutationRepository)

    return await uc.execute({ username })
  }
}
