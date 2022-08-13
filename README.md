# USINNMODELER API

API for the USINN Modeler platform 

[![Open in Gitpod](https://gitpod.io/button/open-in-gitpod.svg)](https://gitpod.io/#https://github.com/DAUUX/usinnmodeler-api)

## Requirements

For development, you will need Node.js and MySQL (or MariaDB) installed in your environment.

## Install

- Clone the repository

- Create the .env file and set the variables, use the .env.example as a template

- Install the dependencies:
```
     $ npm install
```   
- Run the migrations to create the database tables:
```
     $ npx sequelize-cli db:migrate
```
## Running the project

    $ npm start

## Other methods

- Alternatively, if you have docker and docker compose installed, after setting the .env file, just run the `$ docker-compose up` command and you should be good to go