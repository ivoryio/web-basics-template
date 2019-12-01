import { Mapper } from '../../shared/core/Mapper'
import { Salutation } from '../../domain/Salutation'

type KeyValue = {
  [key: string]: string
}

export class SalutationMap implements Mapper<Salutation> {
  public static toDBItem(salutation: Salutation): KeyValue {
    return {
      salutation: salutation.value
    }
  }

  public static fromDBItem(dbItem: any): Salutation {
    const salutationOrError = Salutation.create({ value: dbItem.salutation })

    if (salutationOrError.isFailure) {
      throw new Error(`Corrupt data: ${JSON.stringify(dbItem, null, 2)}`)
    }

    return salutationOrError.getValue()!
  }
}
