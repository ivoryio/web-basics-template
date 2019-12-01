import { Salutation } from '../Salutation'
import { Result } from '../../shared/core/Result'
import { UseCase } from '../../shared/core/UseCase'
import { ISalutationRepository } from '../../persistance/contracts'
import { InvalidSalutationError } from '../errors/InvalidSalutationError'

export interface SaveSalutationProps {
  salutation: string
}

type SaveSalutationUCResult = Result<
  Salutation | null,
  InvalidSalutationError | null
>
type SaveSalutationUC = UseCase<SaveSalutationProps, SaveSalutationUCResult>

export class SaveSalutation implements SaveSalutationUC {
  constructor(greetingRepo: ISalutationRepository) {
    this._greetingRepo = greetingRepo
  }

  public async execute(props: SaveSalutationProps) {
    const salutationOrError = Salutation.create({ value: props.salutation })

    if (salutationOrError.isFailure) {
      return salutationOrError
    }

    await this._greetingRepo.persist(salutationOrError.getValue()!)

    return Result.ok<null, null>()
  }

  private _greetingRepo: ISalutationRepository
}
