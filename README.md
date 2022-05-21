# USINNMODELER API

API for the USINN Modeler platform 

[![Open in Gitpod](https://gitpod.io/button/open-in-gitpod.svg)](https://gitpod.io/#https://github.com/DAUUX/usinnmodeler-api)

## Requirements

For development, you will need Node.js and MySQL installed in your environment.

## Install

- Create the .env file and set the variables, use the .env.example as a template

- Create a database with the same name defined on the .env DB_NAME variable and import the file "usinnmodeler_bd.sql" into it. After that, run the commands:
```
    $ git clone https://github.com/DAUUX/usinnmodeler-api
    $ cd usinnmodeler-api
    $ npm install
```   
## Running the project

    $ npm start

## Other methods

- Alternatively, if you have docker and docker compose installed, after setting the .env file, just run the `$ docker-compose up` command, after that just import the "usinnmodeler_bd.sql" file into the database and you should be good to go