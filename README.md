<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo_text.svg" width="320" alt="Nest Logo" /></a>
</p>

[travis-image]: https://api.travis-ci.org/nestjs/nest.svg?branch=master
[travis-url]: https://travis-ci.org/nestjs/nest
[linux-image]: https://img.shields.io/travis/nestjs/nest/master.svg?label=linux
[linux-url]: https://travis-ci.org/nestjs/nest
  
  <p align="center">It is a seed web API based application made using <a href="http://nodejs.org" target="blank">Node.js</a> and <a href="https://nestjs.com">nest.js</a> framework for building efficient and scalable server-side applications, heavily inspired by <a href="https://angular.io" target="blank">Angular</a>.</p>

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter project.

## Installation

The first step should be copy the .env.dist into .env.

```bash
$ cp .env.dist .env
```

The second step should be review the .env file and assign the variable of your relational database connection and create the database with its proper name.

The thirs step should be install the npm libraries required by the project and run the migrations.

```bash
$ npm install
$ ts-node ./node_modules/.bin/typeorm migration:run -t false
```

You could enter on the API documentation clicking on the [Swagger interface](http://localhost:3000/api/index.html#/) http://localhost:3000/api/index.html#/.

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# incremental rebuild (webpack)
$ npm run webpack
$ npm run start:hmr

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```
## Create & Run Migrations

```sh
ts-node ./node_modules/.bin/typeorm migration:generate -n User
ts-node ./node_modules/.bin/typeorm migration:run -t false
````

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [José Gabriel González](https://github.com/sinner)

## License

  Nest is [MIT licensed](LICENSE).
