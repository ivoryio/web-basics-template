import { Salutation } from "./Salutation"

export default class Greeting {
  public static make(username: string, salutations: Salutation[]) {
    const randomIndex = Math.floor(Math.random() * salutations.length)
    const salutation = salutations[randomIndex]

    return `${salutation.value}, ${username}`
  }
}
