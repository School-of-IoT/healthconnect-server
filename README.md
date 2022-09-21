# HealthConnect-Server

### Base URL: `https://healthconnect-server.herokuapp.com/`

------------------------------------------------------------------------------------------------------------------

### API Endpoints

##### 1. Request All Patient Data

`GET` - `/`

Response: <br>
Example - `https://healthconnect-server.herokuapp.com/`

```json
{
  "patient": [
    {
      "_id": "61deb153d07xxxxfe71fe661",
      "Name": "Axxxxxa",
      "Address": "xxxxxx",
      "Age": 21,
      "Ambulation": false,
      "BMI": 24.7,
      "Chills": false,
      "Contacts": "+91 8xxxxxx828",
      "DBP": 74,
      "DecreasedMood": false,
      "FiO2": 78,
      "GeneralizedFatigue": false,
      "HeartRate": 65,
      "HistoryFever": "Yes",
      "RR": 20,
      "RecentHospitalStay": "Fri Dec 31 1999 18:30:00 GMT+0000 (Coordinated Universal Time)",
      "SBP": 78,
      "SpO2": 95,
      "Temp": 37,
      "WeightGain": 5,
      "WeightLoss": 0,
      "BGroup": "O+",
      "Sex": "Male",
      "pass": "ce4297xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx1a2ffcc937b6789eb98",
      "user": "xxx"
    }
}
```

#### 2. Request Patient Data with 'id'

`GET` - ``/patient/<id>``

Response: <br>
Example - `https://esp32-rest-server.herokuapp.com/patient/xxxxxxxxxxxxxxxxxxx`
           

 ```json
{
  "patient": 
  {
      "_id": "61dfc25c4067828520298884",
      "Name": "Elon Musk",
      "Address": "Texas",
      "Age": 24,
      "Ambulation": false,
      "BMI": 29,
      "Chills": false,
      "Contacts": "+1 98171828178",
      "DBP": 14,
      "DecreasedMood": false,
      "FiO2": 72,
      "GeneralizedFatigue": false,
      "HeartRate": 64,
      "HistoryFever": "Never",
      "RR": 84,
      "RecentHospitalStay": "01/11/2000",
      "SBP": 51,
      "SpO2": 72,
      "Temp": 80,
      "WeightGain": 80,
      "WeightLoss": 0,
      "BGroup": "B+",
      "Sex": "Male",
      "pass": "26433fc29a369a0a254d8e5b5f2c07bd862a1336a647f8f9e3839b8f39837c94",
      "user": "elon"
    }
}
 ```
 
 #### 3. Request Patient with 'user' & 'pass'

`GET` - `/patient/login?user=<user>&pass=<pass>`

Response: <br>
Example - `https://esp32-rest-server.herokuapp.com/patient/login?user=elon&pass=musk`

 ```json
{
  "patient": 
  [
    {
      "_id": "61dfc25c4067828520298884",
      "Name": "Elon Musk",
      "Address": "Texas",
      "Age": 24,
      "Ambulation": false,
      "BMI": 29,
      "Chills": false,
      "Contacts": "+1 98171828178",
      "DBP": 14,
      "DecreasedMood": false,
      "FiO2": 72,
      "GeneralizedFatigue": false,
      "HeartRate": 64,
      "HistoryFever": "Never",
      "RR": 84,
      "RecentHospitalStay": "01/11/2000",
      "SBP": 51,
      "SpO2": 72,
      "Temp": 80,
      "WeightGain": 80,
      "WeightLoss": 0,
      "BGroup": "B+",
      "Sex": "Male",
      "pass": "26433fc29a369a0a254d8e5b5f2c07bd862a1336a647f8f9e3839b8f39837c94",
      "user": "elon"
    }
  ]
}
 ```

#### 4. Create New Patient Account

`POST` - `/patient/signup`

Body:
```json
{
  "newpatient": {
      "Name": "Axxxxxa",
      "Address": "xxxxxx",
      "Age": 21,
      "Ambulation": false,
      "BMI": 24.7,
      "Chills": false,
      "Contacts": "+91 8xxxxxx828",
      "DBP": 74,
      "DecreasedMood": false,
      "FiO2": 78,
      "GeneralizedFatigue": false,
      "HeartRate": 65,
      "HistoryFever": "Yes",
      "RR": 20,
      "RecentHospitalStay": "Fri Dec 31 1999 18:30:00 GMT+0000 (Coordinated Universal Time)",
      "SBP": 78,
      "SpO2": 95,
      "Temp": 37,
      "WeightGain": 5,
      "WeightLoss": 0,
      "BGroup": "O+",
      "Sex": "Male",
      "pass": "ce4297xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx1a2ffcc937b6789eb98",
      "user": "xxx"
  }
}

```
Response:
```json
{
  "message": "Patient Created"
}
```

#### 5. Update Patient data with 'id'

`PUT` - `/patient/update/<id>`

Body:
```json
{
    "patientData":{
        "SBP":	78
    }
}
```

#### 6. Delete Patient Account with 'id'

`DELETE` - `/patient/delete/<id>`

Response:
```json
{
  "message": "Patient Deleted 🔪"
}

#### 6. Delete Patient with 'name'

`DELETE` - `/patient/delete/name/<name>`

Response:
```json
{
  "message": "Patient Deleted 🔪"
}
```
