const { Requester, Validator } = require('external-adapter')

// Define custom error scenarios for the API.
// Return true for the adapter to retry.
const customError = (body) => {
  if (body.Response === 'Error') return true
  return false
}

// Define custom parameters to be used by the adapter.
// Extra parameters can be stated in the extra object,
// with a Boolean value indicating whether or not they
// should be required.
const customParams = {
  set: ['set', 'id'],
  // safeValue: false
}

const createRequest = (input, callback) => {
  // The Validator helps you validate the Chainlink request data
  const validator = new Validator(input, customParams, callback)
  const jobRunID = validator.validated.id
  const url = `https://api.tokensets.com/public/v1/rebalancing_sets`
  const set = validator.validated.data.set.toLowerCase() || 'ethrsiapy'
  // const getSafeValue = validator.validated.data.safeValue === 'true'

  // The Requester allows API calls be retry in case of timeout
  // or connection failure
  Requester.requestRetry(url, customError)
    .then(response => {
      // This API call returns all the sets, we need to find the requested set.
      // We default to 'ethrsiapy' when no set is defined.
      const theSet = response.body['rebalancing_sets'].find(el => el['id'] === set) || {}
      const setPrice = Requester.validateResult(theSet, ['price_usd'])
      // It's common practice to store the desired value at the top-level
      // result key. This allows different adapters to be compatible with
      // one another.
      response.body.result = setPrice
      callback(response.statusCode, Requester.success(jobRunID, response))
    })
    .catch(error => {
      callback(500, Requester.errored(jobRunID, error))
    })
}

// This is a wrapper to allow the function to work with
// GCP Functions
exports.gcpservice = (req, res) => {
  createRequest(req.body, (statusCode, data) => {
    res.status(statusCode).send(data)
  })
}

// This is a wrapper to allow the function to work with
// AWS Lambda
exports.handler = (event, context, callback) => {
  createRequest(event, (statusCode, data) => {
    callback(null, data)
  })
}

// This is a wrapper to allow the function to work with
// newer AWS Lambda implementations
exports.handlerv2 = (event, context, callback) => {
  createRequest(JSON.parse(event.body), (statusCode, data) => {
    callback(null, {
      statusCode: statusCode,
      body: JSON.stringify(data),
      isBase64Encoded: false
    })
  })
}

// This allows the function to be exported for testing
// or for running in express
module.exports.createRequest = createRequest
