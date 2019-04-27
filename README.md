[![Build Status](https://travis-ci.org/fxola/Banka.svg?branch=develop)](https://travis-ci.org/fxola/Banka) [![Coverage Status](https://coveralls.io/repos/github/fxola/Banka/badge.svg?branch=develop)](https://coveralls.io/github/fxola/Banka?branch=develop) [![Test Coverage](https://api.codeclimate.com/v1/badges/7a64ab3f1605506e43b2/test_coverage)](https://codeclimate.com/github/fxola/Banka/test_coverage) [![Maintainability](https://api.codeclimate.com/v1/badges/7a64ab3f1605506e43b2/maintainability)](https://codeclimate.com/github/fxola/Banka/maintainability)

# Banka

Banka is a light-weight core banking application that powers banking operations like account creation, customer deposit and withdrawals.

## Pivotal Tracker

Project is currently being built with the Project Management Tool, Pivotal Tracker. You can find the template at https://www.pivotaltracker.com/n/projects/2321791

## Template Link

Template is hosted at https://fxola.github.io/Banka/UI/index.html

### API Deployment

API is deployed at https://bank-a.herokuapp.com

### API Documentation

The documentation for the API is accessible via https://bank-a.herokuapp.com/documentation

## Built With

<ul>
<li><a href="https://nodejs.org/">NodeJS</a></li>
<li><a href="https://expressjs.com/">ExpressJS</a></li>
<li><a href="https://www.postgresql.org">Postgres</a></li>
<li><a href="https://developer.mozilla.org/kab/docs/Web/HTML">HTML</a></li>
<li><a href="https://developer.mozilla.org/en-US/docs/Web/CSS">CSS</a></li>
<li><a href="https://developer.mozilla.org/bm/docs/Web/JavaScript">JavaScript</a></li>

</ul>

## Getting Started

### Installation

- Clone this repository using `git clone https://github.com/fxola/Banka.git .`
- Use the `.env.example` file to setup your environmental variables and rename the file to `.env`
- Run `npm install` to install all dependencies
- Run `npm start` to start the server

### Supporting Packages

#### Linter

- [ESLint](https://eslint.org/) - Linter Tool

#### Compiler

- [Babel](https://eslint.org/) - Compiler for Next Generation JavaScript

#### Test Tools

- [Mocha](https://mochajs.org/) - JavaScript Test Framework for API Tests (Backend)
- [Chai](http://chaijs.com/) - TDD/BDD Assertion Library for Node
- [Chai-http](https://github.com/visionmedia/supertest) - A Chai plugin for testing node.js HTTP servers
- [Istanbul(nyc)](https://istanbul.js.org/) - Code Coverage Generator

### Testing

<ul><li>Run Test</li></ul>
<pre><code>npm run test</code></pre>
<br>
<ul><li>Run Coverage Report</li></ul>
<pre><code>npm run coverage</code></pre>
<br>

### API Routes

|                DESCRIPTION                 | HTTP METHOD | ROUTES                                                     |
| :----------------------------------------: | ----------- | ---------------------------------------------------------- |
|                Sign up User                | POST        | /api/v1/auth/signup                                        |
|                Log in User                 | POST        | /api/v1/auth/signin                                        |
|           Create a bank account            | POST        | /api/v1/accounts                                           |
|          Activate a bank account           | PATCH       | /api/v1/accounts/account-number                            |
|         Deactivate a bank account          | PATCH       | /api/v1/accounts/{account-number}                          |
|           Delete a bank account            | DELETE      | /api/v1/accounts/{account-number}                          |
|           Credit a bank account            | POST        | /api/v1/transactions/{account-number}/credit               |
|            Debit a bank account            | POST        | /api/v1/transactions/{account-number}/debit                |
|      View account transaction history      | GET         | /api/v1/transactions/accounts/{account-number}/transaction |
|        View a specific transaction         | GET         | /api/v1/transactions/{transaction-id}                      |
| View all accounts owned by a specific user | GET         | /api/v1/user/{user-email}/accounts                         |
|      View specific account's details       | GET         | /api/v1/accounts/{account-number}                          |
|      View a list of all bank accounts      | GET         | /api/v1/accounts/                                          |
|  View a list of all active bank accounts   | GET         | /api/v1/accounts?status=active                             |
|  View a list of all dormant bank accounts  | GET         | /api/v1/accounts?status=dormant                            |

## Project References

- I learnt how to build and structure my project backend with this tutorial by Bolaji Olajide - https://www.youtube.com/watch?v=WLIqvJzD9DE
- I learnt how to implement Authentication with JWT with this tutorial by Academind - https://www.youtube.com/watch?v=0D5EEKH97NA
- Huge Appreciation to Ekunola Ezekiel for letting me use his project for reference - https://github.com/Easybuoy/storemanager
- I found this article by Olawale Aladeusi very helpful while setting up my database - https://www.codementor.io/olawalealadeusi896/building-a-simple-api-with-nodejs-expressjs-and-postgresql-db-masuu56t7
- StackOverflow

## License

&copy; Afolabi Abass Ajanaku

Licensed under the [MIT License](https://github.com/fxola/Banka/blob/develop/LICENSE)
