# hangman-backend

This application is generated using [LoopBack 4 CLI](https://loopback.io/doc/en/lb4/Command-line-interface.html) with the
[initial project layout](https://loopback.io/doc/en/lb4/Loopback-application-layout.html).

## Install dependencies

By default, dependencies were installed when this application was generated.
Whenever dependencies in `package.json` are changed, run the following command:

```sh
npm install
```

To only install resolved dependencies in `package-lock.json`:

```sh
npm ci
```

## Run the application

```sh
npm start
```

You can also run `node .` to skip the build step.

Open http://127.0.0.1:4000 in your browser.

## Rebuild the project

To incrementally build the project:

```sh
npm run build
```

To force a full build by cleaning up cached artifacts:

```sh
npm run rebuild
```

## Fix code style and formatting issues

```sh
npm run lint
```

To automatically fix such issues:

```sh
npm run lint:fix
```

## Other useful commands

- `npm run migrate`: Migrate database schemas for models
- `npm run openapi-spec`: Generate OpenAPI spec into a file

## Tests

```sh
npm test
```

## API Documentation
### POST /games

Description: create a new game which creates a random word to be guessed
using  web service.

### PATCH /games/{id}/letters/{letter}
#### Description:
API used to guess a letter. Will throw error if it is already won
or no guesses left
#### Request parameters
id: unique id of the game
letter: guessed letter which will be validated

### PATCH /games/{id}/words/{word}
#### Description
API used to guess a word. Will throw error if it is already won or
no guesses left

#### Request Parameters
id: id of the game
word: Word to be guessed

### GET /games/{id}
####  Description
Fetch game details by id. Will throw not found error if the id is not found
#### Request Parameters
id: id of the game



## What's next

Please check out [LoopBack 4 documentation](https://loopback.io/doc/en/lb4/) to
understand how you can continue to add features to this application.

[![LoopBack](https://github.com/strongloop/loopback-next/raw/master/docs/site/imgs/branding/Powered-by-LoopBack-Badge-(blue)-@2x.png)](http://loopback.io/)
## TDD of the Application:
https://docs.google.com/document/d/1bfrhWLe_AEcESZjAbrfa86ONytfYONdaUNvQDBvDrnI/edit#
