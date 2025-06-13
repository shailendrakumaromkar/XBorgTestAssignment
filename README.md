# XBorg Tech Challenge

## Submission Requirements

- Unit Tests
- Integration Tests
- E2E Testing
- Testing Performance benchmarks
- Clearly document strategies via effective testing and in the Submission Documentation section of the ReadMe

Implementation should be submitted via a public GitHub repository, or a private repository with collaborator access granted to the provided emails.

## Architecture

- Language - Typescript
- Monorepo - Turborepo
- Client - NextJs
- Api - NestJs
- DB - SQLite

## Apps and Packages

- `client`: [Next.js](https://nextjs.org/) app
- `api`: [Nestjs](https://nestjs.com) app
- `tsconfig`: Typescript configuration used throughout the monorepo

## Utilities

- [TypeScript](https://www.typescriptlang.org/) for static type checking
- [ESLint](https://eslint.org/) for code linting
- [Prettier](https://prettier.io) for code formatting
- [Husky](https://typicode.github.io/husky/) for Git hooks

## Steps to run app

#### Install Metamask [link](https://chromewebstore.google.com/detail/nkbihfbeogaeaoehlefnkodbefgpgknn?utm_source=item-share-cb)

#### Run commands in order

```bash
# Enter all commands from the project root

# Start the infrastructure (Requires Docker)
$ yarn start:local:infra

# Install dependencies
$ yarn install

 # Build the app including the lib
$ yarn build

# Migrate the DB
$ cd apps/api && yarn migrate:local

 # Run the application stack in dev
 $ yarn dev
```

## Additional Commands

```bash
# Run tests in all apps
$ yarn test

# Run linter in all apps
$ yarn lint

# Format code in all apps
$ yarn format

```

## Submission Documentation...

I will be honest here, I didn't got opportunity to learn, work or write tests in Nest JS using Monorepo,
I could have used chatgpt, github co-pilot in writing and submitting this assignment, but that's not correct way.

But I am very strong in API testing, especially in e2e testing
I could have written below test in each category

#### Unit Tests: mocking all below cases

user.service.ts : Test the logic of UserService in isolation, mocking dependencies. No DB involved
UserRepository.create
Positive

1. Pass all params valid value, in proper format, in proper length
2. Verify the registration log message "Registering new user with address"
3. Verify it returns created user

Negative

1. Do not pass any params value
2. Do not pass mandatory params value, i.e. Username
3. Do not pass mandatory params value, i.e. address
4. Pass number instead of string in params
5. Length validation: Pass 1000 chars in params
6. Special chars: Pass special chars value (e.g. ~!@#$%^&\*()\_+{}":?><|`,./;'[]\=-)
7. Pass duplicate/existing value, i.e. User exists Error
8. Pass empty/blank/undefined value
9. Pass value in double quotes (e.g. "usernameindoublequote")
10. In email params, do not pass domain (e.g. testemail, i.e. without @gmail.com)

#### Integration Tests : Test UserService together with UserRepository using a test database or in-memory DB

Positive

1. Pass all params valid value, in proper format, in proper length
2. User & Profile are created and stored in DB
3. Pass duplicate/existing value, i.e. User exists Error
4. Verify in DB all fields with correct data types are saved
5. Verify in DB all field values are retrievable and can be successfully queried

#### E2E (End-to-End) API Tests : full API flow, from HTTP request to database.

POST http://localhost:8080/v1/user/signup

Positive

1. Pass all field correct valid value
2. Verify in response token
3. Verify all codes - 200, 201, 401, 500 etc
   Negative
4. Pass invalid nonce as part of "message"
5. Pass invalid signature
6. Do not pass any params value
7. Do not pass mandatory params value, i.e. Username
8. Do not pass mandatory params value, i.e. message
9. Do not pass mandatory params value, i.e. signature
10. Pass duplicate/existing value for Username
11. Pass duplicate/existing value for message and signature
12. Pass number instead of string in params
13. Length validation: Pass 1000 chars in params
14. Special chars: Pass special chars value (e.g. ~!@#$%^&\*()\_+{}":?><|`,./;'[]\=-)
15. Pass empty/blank/undefined value
16. Pass value in double quotes (e.g. "usernameindoublequote")
17. In email params, do not pass domain (e.g. testemail, i.e. without @gmail.com)

#### E2E (End-to-End) UI (client) Tests : full API flow, from HTTP request to database.

Navigate to apps/client
Install Playwright - yarn create playwright
Create .env file
Enter below data as per your wallet

- seed phrase
- password
  Copy and paste Metamask extension folder content from below source to destination location
  source: C:/Users/CWB/AppData/Local/Google/Chrome/User Data/Default/Extensions/nkbihfbeogaeaoehlefnkodbefgpgknn/12.18.3_0
  destination: apps/client/tests/Metamask
  Navigate to apps/client/tests/xborg-e2e.spec.ts
  Run command: npx playwright test

#### Testing Performance benchmarks

Install k6 at root level of project
Refer: https://grafana.com/docs/k6/latest/set-up/install-k6/
For signup endpoint
Run k6 run -e RATE=100 -e DURATION=300 -e PREALLOCATEDVUS=1000 XBorg_signup.js
For login endpoint
k6 run -e RATE=100 -e DURATION=300 -e PREALLOCATEDVUS=1000 XBorg_login.js

#### Clearly document strategies via effective testing and in the Submission Documentation section of the ReadMe

- Unit Test: Test each method with all positive, negative combination test cases by mocking without DB interaction
- Integration Test: Test each method with all positive, negative combination test cases combining with DB
- E2E: Test all API, Frontend including all components, just like end user uses our product
- Automation: Create automation test scripts to cover E2E end user flows
- Performance: Run load test to meet Acceptance Criteria, Benchmark defined
