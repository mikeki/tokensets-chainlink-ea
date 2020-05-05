# TokenSets - Chainlink External Adapter

External adapter forked from https://github.com/thodges-gh/CL-EA-NodeJS-Template. This adapter will fetch the price of a Set from the TokenSets API https://api.tokensets.com/public/v1/rebalancing_sets. When defining the job spec, we need to define the id of the set to be fetched.

## Input Params

- `tokenset_id`: The id from the set we want to query

## Output

```json
{
 "jobRunID": "278c97ffadb54a5bbb93cfec5f7b5503",
 "data": {
  "id": "<id_of_set>",
  ...

  "price_usd": "164.02",
  "result": "164.02"
 },
 "statusCode": 200
}
```

## Job Spec
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
				"tokenset_id": "ethrsi6040"
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