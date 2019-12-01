import { DocumentClient } from 'aws-sdk/clients/dynamodb'

import { ISalutationRepository } from './contracts'
import { SalutationMap } from './mappers/SalutationMap'
import { Salutation } from '../domain/Salutation'

const dynamoDB = new DocumentClient()
const TableName = process.env.SALUTATION_TABLE!

export class SalutationRepository implements ISalutationRepository {
  public async retrieveAll(): Promise<Salutation[]> {
    const params = {
      TableName
    }
    const data = await dynamoDB.scan(params).promise()

    if (data.Items) {
      return data.Items.map(item => SalutationMap.fromDBItem(item))
    } else {
      return []
    }
  }
  public async persist(salutation: Salutation): Promise<void> {
    const params = {
      TableName,
      Item: { salutation: salutation.value }
    }
    await dynamoDB.put(params).promise()
  }
}
