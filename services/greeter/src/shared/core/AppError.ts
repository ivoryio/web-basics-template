export class AppError {
  public readonly message: string

  protected constructor(message: string) {
    this.message = message

    Object.freeze(this)
  }
}
