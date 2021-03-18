# Covid-19 Stats
For more information regarding the use of the endpoints, please refer to the api docs:
[https://documenter.getpostman.com/view/2357159/Tz5tZbx9](https://documenter.getpostman.com/view/2357159/Tz5tZbx9).

## Configuration

First, get the project directory

```
git clone https://github.com/GWG12/covid19.git
```

Then, install all dependencies:
```
npm install
```
Once everything is installed, create a **.env** file in the root dir:
```
├── _controllers   
│   └── 
├── _middleware   
│   └── 
├── _models   
│   └── 
├── _node_modules   
│   └── 
├── _routes   
│   └── 
├── _util   
│   └── 
├── _validators   
│   └── 
├── auth.js
├── ***.env***
├── .gitignore
├── .app.js
├── .package-lock.json
├── .package.json
└── README.md
```
Add the following env variables:
```
NODE_ENV=development
PORT=8000
# Mongo Credentials
MONGODB_URI= 
# API Credentials
X_RAPIDAPI_KEY=
X_RAPIDAPI_HOST=covid-193.p.rapidapi.com
API_URL=https://covid-193.p.rapidapi.com/statistics
# Jwt token
ACCESS_TOKEN_SECRET=
REFRESH_TOKEN_SECRET=
EXP_DATE_ACCESS_TOKEN = 1h
EXP_DATE_REFRESH_TOKEN = 2h
```
Finally, open a terminal in the same location as the root dir and run:
```
npm start
```
Done!

###### NOTE*
Please feel free to contact me in case of any doubts.