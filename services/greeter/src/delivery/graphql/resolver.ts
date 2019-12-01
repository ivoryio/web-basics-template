import util = require('util')
import { GraphQLResponse } from '../../shared/GraphQLResponse'
import GreetingController from './controllers/GreetingController'
import SalutationController from './controllers/SalutationController'

module.exports.handler = async (event: any) => {
  const {
    operation,
    identity,
    args: { input }
  } = event

  console.log(util.inspect(event, false, 8))

  try {
    switch (event.target) {
      case 'salutation': {
        return await SalutationController.resolve(operation, identity, input)
      }
      case 'greeting': {
        return await GreetingController.resolve(operation, identity, input)
      }
      default: {
        return null
      }
    }
  } catch (err) {
    return GraphQLResponse.fatalFailure(err)
  }
}
