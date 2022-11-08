# HealthConnect-Server

## Base URL: `https://healthconnect-server.onrender.com`

------------------------------------------------------------------------------------------------------------------

## API Endpoints

### 1. Request All Patient Data

`GET` - `/<adminkey>` 
```
Description: Master Data
Parameter: Admin Key - accessible and regenerated by maintainer 
Response: All Patient data in JSON
```
Example - https://healthconnect-server.onrender.com/xxxxxxxxxxxxxxx
```json
{
  "patient": [
    {
      "_id": "12j31k2j3lxxxxfe7d234d261",
      "Name": "txxxxxa",
      "Address": "xxxxxx",
      "Age": 21
    },
    {
      "_id": "6d3ff17xxxxfe72d421",
      "Name": "qxxxxxa",
      "Address": "xxxxxx",
      "Age": 24
    },
    {
      "_id": "54g656ff3xxxxfe7d234d2e661",
      "Name": "pAxxxxxa",
      "Address": "xxxxxx",
      "Age": 35
    }
  ]
}
```

### 2. Request Patient Data with 'id'

`GET` - `/patient/<id>`
```
Description: To get Patient data with 'id'
Parameter: ID - accessible by patient after login
Response: Patient data with particular ID
```
Example - https://healthconnect-server.onrender.com/patient/xxxxxxxxxxxxxxxxxxx

 ```json
{
  "patient": 
  {
      "_id": "2cdgdxxxxxxxxxxxx83da84",
      "Name": "Elon Musk",
      "Address": "Texas",
      "Age": 24,
      "Ambulation": false
    }
}
 ```


### 3. Request Geo Locate API-Key

`GET` - `/geo_locate/:user`
```
Description: To get Geo-API key, used for third party API service
Parameter: user - track number of uses and auto-update API accordingly
Response: geo_api - secret key in JSON
```
Example - https://healthconnect-server.onrender.com/geo_locate/elon

```json
{
  "geo_api": "93h4hd3xxxxxxwe9w382295a"
}
```

### 4. Request JIT token with 'user' & 'pass'

`GET` - `/login?user=<user>&pass=<pass>`
```
Description: To get JIT token with 'user' & 'pass'
Parameter: user & pass - original client key
Response: JIT Token
```
Example - https://healthconnect-server.onrender.com/login?user=elon&pass=xxxx

 ```json
{
  "token":"56d67fb18d4c07e851c29896172797a75bbc32ec2b0f3931ad5521218c3131e4"
}
 ```
 
### 5. Request Patient information using JIT Token

`GET` - `/data?user=<user>&token=<JIT_token>`
```
Description: To get patient data with 'user' & 'token'
Parameter: user & token (generated by respose during login)
Response: Patient Information with provided username - authenticated by token
```
Example - https://healthconnect-server.onrender.com/data?user=elon&token=xxxxxxxxxxxxxxxx

 ```json
{
  "patient": 
  {
      "_id": "2cdgdxxxxxxxxxxxx83da84",
      "Name": "Elon Musk",
      "Address": "Texas",
      "Age": 24,
      "Ambulation": false
    }
}
```

### 6. Create new Patient Account

`POST` - `/patient/signup`
```
Description: To create new patient - Using schema model, add new entry on mongoDB
Request: JSON Body with Patient Information
Response: Patient Created
```
Request Body -
```json
{
  "newpatient": {
      "Name": "Axxxxxa",
      "Email": "abc@gog.com",
      "DOB": "1/12/1999"
      "Address": "xxxxxx",
      "Age": 21,
      "Ambulation": false,
      "BMI": 24.7,
      "Chills": false,
      "Contacts": "8xxxxxx828",
      "DBP": 74,
      "DecreasedMood": false,
      "FiO2": 78,
      "GeneralizedFatigue": false,
      "HeartRate": 65,
      "HistoryFever": "Yes",
      "RR": 20,
      "RecentHospitalStay": "05/04/2019",
      "SBP": 78,
      "SpO2": 95,
      "Temp": 37,
      "WeightGain": 5,
      "WeightLoss": 0,
      "BGroup": "O+",
      "Sex": "Male",
      "pass": "xxxx",
      "user": "elon"
  }
}

```
Response - 
```json
{
  "message": "Patient Created"
}
```

### 7. Update Patient data with 'ID'

`PUT` - `/patient/update/<id>`
```
Description: To Update a Patient Information
Parameter: ID - accessible by patient after login
Request: JSON Body with new data
Response: New Patient Information
```
Request Body -
```json
{
    "patientData":{
        "SBP":	78
    }
}
```
Response - 
```json
{
  "patient": 
  {
      "_id": "2cdgdxxxxxxxxxxxx83da84",
      "Name": "Elon Musk",
      "Address": "Texas",
      "Age": 24,
      "SBP":	78
    }
}
```

### 8. Delete Patient Account with 'ID'

`DELETE` - `/patient/delete/<id>`
```
Description: To Update a Patient Information
Parameter: ID - accessible by patient after login
Request: JSON Body with new data
```
Response -
```json
{
  "message": "Patient Deleted 🔪"
}
```