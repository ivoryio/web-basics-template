export class Result<V, E> {
  public isSuccess: boolean
  public isFailure: boolean

  public constructor(isSuccess: boolean, error?: E | string | null, value?: V) {
    if (isSuccess && error) {
      throw new Error(
        'InvalidOperation: A result cannot be successful and contain an error'
      )
    }
    if (!isSuccess && !error) {
      throw new Error(
        'InvalidOperation: A failing result needs to contain an error message'
      )
    }

    this.error = error
    this._value = value
    this.isSuccess = isSuccess
    this.isFailure = !isSuccess

    Object.freeze(this)
  }

  public static ok<V, E>(value?: V): Result<V, E> {
    return new Result<V, E>(true, null, value)
  }

  public static fail<V, E>(error: string | E): Result<V, E> {
    return new Result<V, E>(false, error)
  }

  public static combine(results: Result<any, any>[]): Result<any, any> {
    for (let result of results) {
      if (result.isFailure) return result
    }
    return Result.ok()
  }

  public getValue(): V {
    if (!this.isSuccess) {
      throw new Error(
        'Cannot get the value of an error result. Use <errorValue> instead.'
      )
    }
    return this._value as V
  }

  public getErrorValue(): E {
    return this.error as E
  }

  private _value?: V
  private error?: E | string | null
}
