# Questions And Answers API
## Get All Questions For Product
* GET `/qa/questions/:product_id`

** Path Params **
* product_id	integer	Specifies the product for which to retrieve questions.

**Success Status Code:** `200`

**Returns:** JSON

```json 
    {
      [{
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
