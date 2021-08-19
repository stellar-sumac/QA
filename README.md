# Questions And Answers API
## Get All Questions For Product
 Responds with only questions NOT marked as reported.
* GET `/qa/questions/:product_id`

Path Params

| **Paramater** | **Type** | **Description** |
|:----------|:----:|:-----------|
| product_id | Integer | Specifies the product for which to retrieve questions.

Query Parameters

| **Paramater** | **Type** | **Description** |
|:----------|:----:|:-----------|
| page | Integer | Selects the page of results to return. Default 1. |
| count | Integer | Specifies how many results per page to return. Default 5.

**Success Status Code:** `200`

**Returns:** JSON

```json
    {
      "product_id": "Number",
      "page": "Number",
      "count": "Number",
      "results": [{
        "question_id": "Number",
        "question_body": "String",
        "question_date": "Date",
        "asker_name": "String",
        "question_helpfulness": "Number",
        "reported": "Boolean",
        "answers": {
          "id": {
            "id": "Number",
            "body": "String",
            "date": "Date",
            "answerer_name": "String",
            "helpfulness": "Number",
            "photos": [],
          }
        }
      }]
    }
```

## Get All Answers For A Question
 Responds with only answers NOT marked as reported.
* GET `/qa/questions/:question_id/answers`

Path Params

| **Paramater** | **Type** | **Description** |
|:----------|:----:|:-----------|
| question_id | Integer | Specifies the question for which to retrieve answers.

Query Parameters

| **Paramater** | **Type** | **Description** |
|:----------|:----:|:-----------|
| page | Integer | Selects the page of results to return. Default 1. |
| count | Integer | Specifies how many results per page to return. Default 5.


**Success Status Code:** `200`

**Returns:** JSON

```json
    {
      "question": "Number",
      "page": "Number",
      "count": "Number",
      "results": [{
        "question_id": "Number",
        "question_body": "String",
        "question_date": "Date",
        "asker_name": "String",
        "question_helpfulness": "Number",
        "reported": "Boolean",
        "answers": {
          "id": {
            "id": "Number",
            "body": "String",
            "date": "Date",
            "answerer_name": "String",
            "helpfulness": "Number",
            "photos": [],
          }
        }
      }]
    }
```
