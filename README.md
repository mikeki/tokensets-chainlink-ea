# TokenSets - Chainlink External Adapter

External adapter forked from https://github.com/thodges-gh/CL-EA-NodeJS-Template. This adapter will fetch the price of a Set from the TokenSets API https://api.tokensets.com/public/v1/rebalancing_sets. When defining the job spec, we need to define the id of the set to be fetched.

## Input Params

- `tokenset_id` or `tokensetId`: The id from the set we want to query

## Querying a specific Set from your Smart Contract

```
req.add("tokensetId", "ethrsiapy");
```

## Output

```
{
  "jobRunID": "278c97ffadb54a5bbb93cfec5f7b5503",
  "data": {
    "id": "<id_of_set>",
    //... <tokenset data which can be parsed with parseJson task>
    "price_usd": "164.02",
    "result": "164.02"
   },
   "statusCode": 200
}
```

## Job Spec

For serving a specific set, set the `tokensetId` parameter in the JobSpec.
If you want to allow the callers to specify their own set, leave the params empty.

```
{
  "initiators": [
    {
      "type": "runlog",
      "params": {
        "address": <YOUR_ORACLE_CONTRACT_ADDRESS>
      }
    }
  ],
  "tasks": [
    {
      "type": "tokensets",
      "confirmations": null,
      "params": {
        // OPTIONAL: If you set this param in the JobSpec, this Job will always return the price for this token
        // If the params are empty, then it's up to the consumer to specificy which token they want.
        // "tokenset_id": <TOKENSET_ID>
      }
    },
    {
      "type": "multiply",
      "confirmations": null,
      "params": {}
    },
    {
      "type": "ethuint256",
      "confirmations": null,
      "params": {}
    },
    {
      "type": "ethtx",
      "confirmations": null,
      "params": {}
    }
  ],
  "startAt": null,
  "endAt": null
}
```

## Install

```bash
yarn
```

## Test

```bash
yarn test
```

## Create the zip

```bash
zip -r cl-ea.zip .
```

## Docker

If you wish to use Docker to run the adapter, you can build the image by running the following command:

```bash
docker build . -t cl-ea
```

Then run it with:

```bash
docker run -p 8080:8080 -it cl-ea:latest
```

## Install to AWS Lambda

- In Lambda Functions, create function
- On the Create function page:
  - Give the function a name
  - Use Node.js 12.x for the runtime
  - Choose an existing role or create a new one
  - Click Create Function
- Under Function code, select "Upload a .zip file" from the Code entry type drop-down
- Click Upload and select the `cl-ea.zip` file
- Handler should remain index.handler
- Add the environment variable (repeat for all environment variables):
  - Key: API_KEY
  - Value: Your_API_key
- Save

#### To Set Up an API Gateway

An API Gateway is necessary for the function to be called by external services. You will need to disable the Lambda proxy integration for this to work as expected.

- Click Add Trigger
- Select API Gateway in Trigger configuration
- Under API, click Create an API
- Choose REST API
- Select the security for the API
- Click Add
- Click the API Gateway trigger
- Click the name of the trigger (this is a link, a new window opens)
- Click Integration Request
- Uncheck Use Lamba Proxy integration
- Click OK on the two dialogs
- Return to your function
- Remove the API Gateway and Save
- Click Add Trigger and use the same API Gateway
- Select the deployment stage and security
- Click Add

## Install to GCP

- In Functions, create a new function, choose to ZIP upload
- Click Browse and select the `cl-ea.zip` file
- Select a Storage Bucket to keep the zip in
- Function to execute: gcpservice
- Click More, Add variable (repeat for all environment variables)
  - NAME: API_KEY
  - VALUE: Your_API_key
