import { Guard } from '../shared/core/Guard'
import { Result } from '../shared/core/Result'
import { ValueObject } from '../shared/domain/ValueObject'
import { InvalidSalutationError } from './errors/InvalidSalutationError'

interface SalutationProps {
  value: string
}

export class Salutation extends ValueObject<SalutationProps> {
  public static minLength: number = 2
  public static manxLength: number = 10

  public static create(
    props: SalutationProps
  ): Result<Salutation | null, InvalidSalutationError | null> {
    const nullGuardResult = Guard.againstNullOrUndefined(
      props.value,
      'salutation'
    )

    if (!nullGuardResult.succeeded) {
      return Result.fail<null, InvalidSalutationError>(
        new InvalidSalutationError(nullGuardResult.message!)
      )
    }

    const minGuardResult = Guard.againstAtLeast(this.minLength, props.value)
    const maxGuardResult = Guard.againstAtMost(this.manxLength, props.value)

    if (!minGuardResult.succeeded) {
      return Result.fail<null, InvalidSalutationError>(
        new InvalidSalutationError(minGuardResult.message!)
      )
    }
    if (!maxGuardResult.succeeded) {
      return Result.fail<null, InvalidSalutationError>(
        new InvalidSalutationError(maxGuardResult.message!)
      )
    }

    return Result.ok<Salutation, null>(new Salutation(props))
  }

  get value(): string {
    return this.props.value
  }
}
