const assert = require('chai').assert
const createRequest = require('../index.js').createRequest

describe('createRequest', () => {
  const jobID = '1'

  context('successful calls', () => {
    const requests = [
      { name: 'id not supplied', testData: { data: { tokenset_id: '' } } },
      { name: 'using tokenset_id param', testData: { id: jobID, data: { tokenset_id: 'ethbtcrsi7030' } } },
      { name: 'using tokensetId param', testData: { id: jobID, data: { tokensetId: 'ethbtcrsi7030' } } }
    ]

    requests.forEach(req => {
      it(`${req.name}`, (done) => {
        createRequest(req.testData, (statusCode, data) => {
          assert.equal(statusCode, 200)
          assert.equal(data.jobRunID, jobID)
          assert.isNotEmpty(data.data)
          assert.isAbove(Number(data.result), 0)
          assert.isAbove(Number(data.data.result), 0)
          done()
        })
      })
    })
  })

  context('error calls', () => {
    const requests = [
      { name: 'empty body', testData: {} },
      { name: 'empty data', testData: { data: {} } },
      { name: 'set not supplied', testData: { id: jobID, data: {} } },
      { name: 'wrong parameter', testData: { id: jobID, data: { set: 'ethbtcrsi7030' } } },
      { name: 'unknown set', testData: { id: jobID, data: { tokenset_id: 'fake_id' } } }
    ]

    requests.forEach(req => {
      it(`${req.name}`, (done) => {
        createRequest(req.testData, (statusCode, data) => {
          assert.equal(statusCode, 500)
          assert.equal(data.jobRunID, jobID)
          assert.equal(data.status, 'errored')
          assert.isNotEmpty(data.error)
          done()
        })
      })
    })
  })
})
