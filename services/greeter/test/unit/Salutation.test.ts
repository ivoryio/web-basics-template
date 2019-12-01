import { Salutation } from '../../src/domain/Salutation'
import { InvalidSalutationError } from '../../src/domain/errors/InvalidSalutationError'

describe('Salutation', () => {
  describe('create', () => {
    test('is successful if salutation valid', () => {
      const validSaluation = 'Hey!'
      const salutationResult = Salutation.create({ value: validSaluation })
      const salutation = salutationResult.getValue()

      expect(salutationResult.isSuccess).toBeTruthy()
      expect(salutation!.value).toEqual(validSaluation)
    })
    test('fails if salutation does not satisfy minimum chars requirement ', () => {
      const salutationResult = Salutation.create({ value: 'H' })
      const error = salutationResult.getErrorValue()

      expect(salutationResult.isFailure).toBeTruthy()
      expect(error!.constructor === InvalidSalutationError).toBeTruthy()
      expect(error!.message).toEqual('Text is not at least 2 chars.')
    })
    test('fails if salutation does not satisfy maximum chars requirement ', () => {
      const invalidSalutation = 'H'.repeat(11)
      const salutationResult = Salutation.create({ value: invalidSalutation })
      const error = salutationResult.getErrorValue()

      expect(salutationResult.isFailure).toBeTruthy()
      expect(error!.constructor === InvalidSalutationError).toBeTruthy()
      expect(error!.message).toEqual('Text is greater than 10 chars.')
    })
  })
})
