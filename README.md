<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

<p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
<p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
<a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
<a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
<a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>

## Description

A Nest.js microservice for managing users with caching and search functionality. This service includes user blocking functionality where blocked users are not visible in search results. The database used can be either PostgreSQL or MongoDB. 

### Minimum Fields for User

- id
- name
- surname
- username
- birthdate

### Controllers

1. **UserController**:
   - Implement CRUD operations for user data.
   - Create an endpoint to search users by username and/or age range (GET /users/search).

2. **BlockController**:
   - Block and unblock routes (no need to get blocked or unblocked users).

### Features

- CRUD operations for user data.
- User blocking functionality.
- Search users by username and/or age range.
- Exclude blocked users from search results.
- Caching frequently accessed data using Redis.

## Installation

### Clone the repository

```bash
git clone https://github.com/your-username/user-management-service.git
cd user-management-service
```

### Install dependencies

```bash
npm install
```

### Set up the database

Configure your database connection in `ormconfig.json` for PostgreSQL or `app.module.ts` for MongoDB.

### Install Redis

Follow the instructions to install Redis on your machine:

- For macOS: `brew install redis`
- For Ubuntu: `sudo apt-get install redis-server`
- For Windows: [Download Redis](https://redis.io/download)

### Start Redis

```bash
redis-server
```

## Running the app

```bash
# development
npm run start

# watch mode
npm run start:dev

# production mode
npm run start:prod
```

## Test

```bash
# unit tests
npm run test

# e2e tests
npm run test:e2e

# test coverage
npm run test:cov
```

## Project Structure

```
└── 📁src
    └── .DS_Store
    └── app.controller.spec.ts
    └── app.controller.ts
    └── app.module.ts
    └── app.service.ts
    └── 📁block
        └── block.controller.ts
        └── block.entity.ts
        └── block.module.ts
        └── block.service.ts
        └── 📁dtos
            └── block-user.dto.ts
            └── unblock-user.dto.ts
    └── 📁common
        └── 📁cache
            └── cache.module.ts
            └── cache.service.ts
    └── main.ts
    └── 📁middlewares
        └── jwt.middleware.ts
    └── 📁user
        └── 📁dtos
            └── create-user.dto.ts
            └── search-user.dto.ts
            └── update-user.dto.ts
        └── user.controller.ts
        └── user.entity.ts
        └── user.module.ts
        └── user.service.ts
```

## Modules Description

### CacheService Module

The CacheService module uses Redis to cache frequently accessed data, improving the performance and scalability of the application.

### Block Module

The Block module handles the functionality for blocking and unblocking users. It includes:
- `block.controller.ts`: Handles the HTTP requests for blocking and unblocking users.
- `block.entity.ts`: Defines the Block entity.
- `block.service.ts`: Contains the business logic for blocking and unblocking users.

### User Module

The User module handles all user-related functionalities, including CRUD operations and searching for users. It includes:
- `user.controller.ts`: Handles the HTTP requests for user operations.
- `user.entity.ts`: Defines the User entity.
- `user.service.ts`: Contains the business logic for user operations.

### Middleware

The JWT middleware is used to extract the user ID from the JWT token for the search functionality.

## Setup Information

### 1. Clone the repository and install dependencies

```bash
git clone https://github.com/your-username/user-management-service.git
cd user-management-service
npm install
```

### 2. Configure the database

Update your database configuration in `ormconfig.json` or `app.module.ts`.

### 3. Install and start Redis

- Install Redis:
  - macOS: `brew install redis`
  - Ubuntu: `sudo apt-get install redis-server`
  - Windows: [Download Redis](https://redis.io/download)

- Start Redis:

```bash
redis-server
```

### 4. Start the application

```bash
npm run start
```

## API Documentation

The application's Swagger API documentation will open on this link: [http://localhost:3000/api](http://localhost:3000/api)

## Sample .env

```dotenv
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_NAME=user_management_service
REDIS_HOST=localhost
REDIS_PORT=6379
```
