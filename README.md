# System-Demo

To start, run:

docker-compose up -d

[![reddit-api](https://github.com/ccs14/system-demo/actions/workflows/reddit-api.yml/badge.svg)](https://github.com/ccs14/system-demo/actions/workflows/reddit-api.yml)

[![analytics-service](https://github.com/ccs14/system-demo/actions/workflows/analytics-service.yml/badge.svg)](https://github.com/ccs14/system-demo/actions/workflows/analytics-service.yml)

![design](design/system-design.png)

# Overview

- This is an always-in-progress system I use to practice building and learning modern technologies.
- I learn best by doing, this repo is where I prototype, iterate quickly, and stay hands-on throughout the process.
- Some components exist mainly to demonstrate concepts or explore specific tools/patterns, even if they aren’t strictly “needed” for the core app.
- Future ideas are listed below (not in priority order).

# Future State

Analytics Service

- Expand features and software design to illustrate SOLID principals
- Add test project
- Add tests to CI/CD pipeline
- Record counts for each unique subreddit that is consumed (will need to re-work Rabbit payload and data models)
- Expand API reporting

Tests

- Add tests for reddit api (Jest?)
- Add tests for analytics (NUnit)

CI/CD

- Add unit tests to Github Actions
- Jenkins is another option in a separate container with custom jobs

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

Other

- Webhooks
  - producer
  - consumer
  - add auth

- Async Patterns
  - async/await
  - SemaphoreSlim
  - producer/consumer
  - multithreaded processing

# Completed

- Build api to pull data from reddit
- Write results to redis cache
- Pull data from cache on hit
- Push messages to rabbitmq
- Build DDD analytics service in dotnet 8
- Read data from rabbit and write to postgres
- Read analytics data from postgres with api
- Create CI github action for analytics service
- Localstack added to migrate to a traditional cloud workflow, but none of it is hooked up in the system
