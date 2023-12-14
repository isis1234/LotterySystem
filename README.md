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

### Limitation
1. API might reach the max call
2. mongo connection pool might reach the max call