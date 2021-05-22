# E2E Tests
## Dumping and Restoring the test database

**Saving current database state**

To save the current state of the database for the next e2e tests you will need to dump it into the file MericoE2E.dump

```sh
# defaults: DATABASE_NAME=cedatabase FILE=MericoE2E.dump
./dump.sh $DATABASE_NAME $FILE
```

**Clearing your local database**
```sh
# You may need to change the variables
psql --host="localhost" --username="merico" --dbname="cebackend" --password --command="drop schema public cascade; create schema public;"
```

**Restoring test database locally**

To import all the test database locally, note that it only works when the db is clear

```sh
# defaults:
# DATABASE_NAME=cedatabase HOST=localhost FILE=MericoE2E.dump USER=merico PASSWORD=merico FILE=MericoFE.dump
./restore_db.sh $DATABASE_NAME $HOST $USER $PASSWORD $FILE
```


##  Debugging and generating E2E tests
## Running
This is meant to be used for development of new tests and you should use `Running E2E with docker-compose` to do test runs of all your tests.

1. Database setup
   1. See *Clearing your local database*
   2. Then see *Restoring test database locally*
2. Back-end setup
   1. You should be running the same node version as production
   2. From your back-end project root run `npm run e2e-test`.
3. Front-end setup
   1. You should be running the same node version as Docker.production
   1. Go to your front-end project root
   2. Run `npm run dev` to start a development server
   3. Run `npm run cypress` to start the cypress gui

## Development
All tests we currently have resides in `/cypress/integration`

**Authenticated tests**

For authentication we are using `cy.login();` it will call a command from `/cypress/support/command.js`


## Running E2E with docker-compose

Using our docker-compose you will setup an entire environement to run your tests with, this will also use a separate database that will be cleaned up every new run.

1. Install docker and docker-compose
2. Stop your local back-end and front-end servers
3. Stop your postgres service locally: `sudo service stop postgresql`
4. Go to the project root
5. Open https://gitlab.com/merico-dev/ce/ce-backend/-/settings/ci_cd and grab the value for master1hash
6. Edit docker-compose.yml and replace `__HASH__` with the value you found from master1hash (something similar to master-95770670)
7. Run `npm run build-e2e`
8. Run `docker-compose down` to remove all data the container might have
9. Run `docker-compose up --build`

## Risks
If you run our e2e test suit against a remote server your actions will be reflected in the remote database. Running the tests in a database not designed specifically for that may cause tests to fail.
