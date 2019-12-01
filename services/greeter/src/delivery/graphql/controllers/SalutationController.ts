import { GraphQLResponse } from '../../../shared/GraphQLResponse'
import { SalutationRepository } from '../../../persistance/SalutationRepository'
import { ISalutationRepository } from '../../../persistance/contracts'
import { SaveSalutation } from '../../../domain/usecases/SaveSalutation'

export default class SalutationController {
  public static readonly greetingRepository: ISalutationRepository = new SalutationRepository()

  public static async resolve(operation: string, identity: any, input: any) {
    switch (operation) {
      case 'saveSalutation': {
        const result = await this.resolveSaveSalutation(input)

        if (result.isSuccess) {
          return GraphQLResponse.success()
        } else {
          return GraphQLResponse.failure(result.getErrorValue()!)
        }
      }
      default: {
        return null
      }
    }
  }

  private static async resolveSaveSalutation(input: any) {
    const { salutation } = input
    const uc = new SaveSalutation(SalutationController.greetingRepository)
    return await uc.execute({ salutation })
  }
}
