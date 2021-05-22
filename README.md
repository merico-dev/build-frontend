# Merico Build

The is the front-end code for Merico Build

## Installation

To install Merico Build you must have [NodeJs](https://nodejs.org/) installed in your machine, node comes wih npm built-in.

Open a terminal an run

```
yarn i
```

This will install all dependencies in you local environment

## Running locally

After installing and running the [back-end service](https://gitlab.com/merico-dev/ce/ce-backend)  locally run:

```
yarn run dev
```

## Running unit tests

To run everything once

```
yarn run test
```

If you want to watch the code changes and run tests on changed files run

```
yarn run test:watch
```

## Testing the build locally

If you want to test our build in you local environment you can run

```
yarn run build-local
```

## Running E2E tests locally

To run the E2E tests locally please refer to `./cypress/README.md`
