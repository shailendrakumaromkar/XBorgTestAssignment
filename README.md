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

I will be honest here, I didn't get opportunity to work or write tests in Nest JS using Monorepo,  
I could have used Chatgpt, Github Copilot in writing and submitting this assignment, but that's not the correct way.

But I am very strong in API testing, especially in e2e testing

Below are some of the test cases in each category, there is scope for more test cases as well to cover-

**Unit Tests**: mocking all below cases  
`user.service.ts` : Test the logic of UserService in isolation, mocking dependencies, no DB involved.  
`UserRepository.create`

**Positive**

1. Pass all params valid value, in proper format, in proper length
2. Verify the registration log message "Registering new user with address"
3. Verify it returns created user

**Negative**

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

**Integration Tests** : Test `UserService` together with `UserRepository` using a test database or in-memory DB

**Positive**

1. Pass all params valid value, in proper format, in proper length
2. User & Profile are created and stored in DB
3. Pass duplicate/existing value, i.e. User exists Error
4. Verify in DB all fields with correct data types are saved
5. Verify in DB all field values are retrievable and can be successfully queried

**Negative**

1. Create user with missing required fields
2. Create user giving invalid data types
3. Make the DB down/inaccessible permanently and try creating user
4. Retry logic: make DB down/inaccessible temporarily and try creating user
5. Find user with non-existing ID
6. Try to create user with data exceeding allowed length
7. Special chars: Pass special characters value (e.g. ~!@#$%^&\*()\_+{}":?><|`,./;'[]\=-)

**E2E (End-to-End) API Tests** : full API flow, from HTTP request to database.

- POST http://localhost:8080/v1/user/signup

**Positive**

1. Pass all field with correct valid values
2. Verify token in response
3. Verify all relevant API status codes (e.g., 200, 201, 401, 500, etc.)

**Negative**

1. Pass invalid nonce as part of "message"
2. Pass invalid "signature"
3. Do not pass any params value
4. Do not pass mandatory params value, i.e. username
5. Do not pass mandatory params value, i.e. message
6. Do not pass mandatory params value, i.e. signature
7. Pass duplicate/existing value for username
8. Pass duplicate/existing value for message and signature
9. Pass number instead of string in params
10. Length validation: Pass 1000 chars in params
11. Special chars: Pass special chars value (e.g. ~!@#$%^&\*()\_+{}":?><|`,./;'[]\=-)
12. Pass empty/blank/undefined value
13. Pass value in double quotes (e.g., "usernameInDoubleQuotes")
14. In email params, do not pass domain (e.g. testemail, i.e. without @gmail.com)

- POST http://localhost:8080/v1/user/login

**Positive**

1. Pass all "message", "signature" field correct valid value
2. Verify token in responses
3. Verify all relevant API status codes (e.g., 200, 201, 401, 500, etc.)

**Negative**

1. Pass invalid nonce as part of "message"
2. Pass invalid "signature"
3. Do not pass any params value
4. Do not pass mandatory params value, i.e. message
5. Do not pass mandatory params value, i.e. signature
6. Pass duplicate/existing value for "message" and "signature"
7. Pass wrong value format in "message" and "signature"
8. Pass tampered value in "message"
9. Pass tampered value in "signature"
10. Pass empty/blank/undefined value

**E2E (End-to-End) UI (client) Tests**: full application flow from end user perspective.  
It covers two test cases: Signup & Login

1. Navigate to `apps/client`
2. Install Playwright
   ```bash
   yarn create playwright
   ```
3. Create a `.env` file
4. Enter the following data as per your wallet:
   - seed phrase
   - password
5. Copy and paste the Metamask extension folder content from the source to the destination location:
   - **Source:** `C:/Users/TestUser/AppData/Local/Google/Chrome/User Data/Default/Extensions/{Metamask Extension Folder Name}/{Metamask Extension version}`
   - **Destination:** `apps/client/tests/Metamask`
6. Navigate to `apps/client/tests/xborg-e2e.spec.ts`
7. Run the command:

   ```bash
   npx playwright test
   ```

**Testing Performance benchmarks**  
It covers two endpoints: Signup & Login

1. Install k6 at the root level of the project, [refer] (https://grafana.com/docs/k6/latest/set-up/install-k6/)
2. For the `signup` endpoint, run:
   ```bash
   k6 run -e RATE=100 -e DURATION=300 -e PREALLOCATEDVUS=1000 XBorg_signup.js
   ```
3. For the `login` endpoint, run:
   ```bash
   k6 run -e RATE=100 -e DURATION=300 -e PREALLOCATEDVUS=1000 XBorg_login.js
   ```
4. Re-run the test script, making changes in parameterss to meet the desire throughput.


**Clearly document strategies via effective testing and in the Submission Documentation section of the ReadMe**

- Unit Test: Test each method with all positive, negative combination test cases by mocking without DB interaction.
- Integration Test: Test each method with all positive, negative combination test cases together with DB.
- E2E: Test all API, Frontend part including all components, just like an end user uses our product.
- Automation: Create automation test scripts to cover E2E end user flows to catch any regression issues before releasing to production.
- Performance: Run load test to meet Acceptance Criteria, Benchmark defined for expected throughput, ensuring tnfrastructure resources (RAM, CPU, Network) are within configured limits and application pods/containers are stable.
