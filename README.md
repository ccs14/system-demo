# reddit-server

To start...
run:

- **docker-compose up -d**

# TODO

- System Design doc
- Analytics Service in dotnet

  - Pull messages from RabbitMQ
  - Write to db
  - Expose analytics API

- Add unit tests

# Future State

CI/CD

- Jenkins
- Pipeline for Unit Tests

Logging

- ELK Stack
- Datadog
- SumoLogic
- Seq on Local

Front End

- Simple frontend with a fixed size textbox to take in the subreddit name
- Dropdown for the top/random param
- Dropdown for the day/year param
- Add auth service and login page to access
- Toggle to disable auth for quick testing/demo purposes

Auth Service

- Okta / Oauth2
- Handle creds from database
  - salted and hashed at rest

Login Service

- Called by UI/frontend
- Could handle new account creation and call auth service downstream
- Handle user creation/logins with datastore
- Hashed and salted passwords at rest in db
- Separating the auth service could be overkill/unnecessary
  - Need to investigate controllers and what is needed to make the right sizing/complexity considerations
