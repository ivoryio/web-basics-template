import { Result } from '../../shared/core/Result'
import { UseCase } from '../../shared/core/UseCase'
import { ISalutationRepository } from '../../persistance/contracts'
import Greeting from '../Greeting'

export interface GetRandomGreetingProps {
  username: string
}

type UCResult = Result<string | null, null>
type GetRandomGreetingUC = UseCase<GetRandomGreetingProps, UCResult>

export class GetRandomGreeting implements GetRandomGreetingUC {
  constructor(greetingRepo: ISalutationRepository) {
    this._greetingRepo = greetingRepo
  }

  public async execute(props: GetRandomGreetingProps) {
    const { username } = props

    const salutations = await this._greetingRepo.retrieveAll()
    const greeting = Greeting.make(username, salutations)

    return Result.ok<string, null>(greeting)
  }

  private _greetingRepo: ISalutationRepository
}
