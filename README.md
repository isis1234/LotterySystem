## Setup script
1. `git clone https://github.com/isis1234/LotterySystem.git`
2. create a file with .env
	```
	PORT=3000
	MONGO_URL=secret
	DRAW_SCHEDULE=* * * * * *
	WINNER_SCHEDULE=* * * * *
	```
3. `npm install`
4. `npm start`

## Swagger
{{host}}/api-docs

## Test case supported
- Get draw number hisotry
	1. page: null, size: null
	2. page: last page + 2
	3. run time <= 2sec in size = 10
	4. run time <= 5sec in size = 20

## Limitation
1. API might reach the max call
2. mongo connection pool might reach the max call
3. might use long query time when data >= 20K