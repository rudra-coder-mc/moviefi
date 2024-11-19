# MovieFi

MovieFi is a full-stack Next.js application designed for movie enthusiasts to manage their personal movie collections. The platform supports user authentication, movie management, and is equipped with a modern CI/CD pipeline using CircleCI for seamless deployments.

## Table of Contents

- [Features](#features)
- [Getting Started](#getting-started)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Usage](#usage)
- [Deployment](#deployment)
  - [Docker Setup](#docker-setup)
    - [Dockerfile](#dockerfile)
    - [Deployment to AWS EC2 with Docker](#deployment-to-aws-ec2-with-docker)
  - [CI/CD with CircleCI](#cicd-with-circleci)

## Features

### User Authentication

- Login and Signup functionality for secure user management.

### Movie Management

- View all movies displayed in a card layout (title, year, poster).
- Add new movies via a dedicated form.
- Edit existing movie details.

### CI/CD

- Continuous Integration and Deployment using CircleCI.

## Getting Started

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/moviefi.git
   cd moviefi
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Build the application:

   ```bash
   npm run build
   ```

### Environment Variables

Create a `.env` file in the root directory and configure the following variables:

```plaintext
MONGO_URL=your_mongo_url
TOKEN_SECRET=your_token_secret
EDGE_STORE_ACCESS_KEY=your_edge_store_access_key
EDGE_STORE_SECRET_KEY=your_edge_store_secret_key
```

## Usage

Start the development server:

```bash
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000).

## Deployment

### Docker Setup

#### Dockerfile

Below is the Dockerfile used to build and deploy the MovieFi application:

```yaml
# syntax=docker.io/docker/dockerfile:1

FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* .npmrc* ./
RUN \
  if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
  elif [ -f package-lock.json ]; then npm ci; \
  elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm i --frozen-lockfile; \
  else echo "Lockfile not found." && exit 1; \
  fi

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Define build-time arguments
ARG MONGO_URL
ARG TOKEN_SECRET
ARG EDGE_STORE_ACCESS_KEY
ARG EDGE_STORE_SECRET_KEY

# Set the arguments as environment variables for the build process
ENV MONGO_URL=$MONGO_URL
ENV TOKEN_SECRET=$TOKEN_SECRET
ENV EDGE_STORE_ACCESS_KEY=$EDGE_STORE_ACCESS_KEY
ENV EDGE_STORE_SECRET_KEY=$EDGE_STORE_SECRET_KEY

# Build the Next.js app
RUN \
  if [ -f yarn.lock ]; then yarn run build; \
  elif [ -f package-lock.json ]; then npm run build; \
  elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm run build; \
  else echo "Lockfile not found." && exit 1; \
  fi

FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

# Ensure the app runs as a non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy necessary files
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Expose and set runtime environment variables
ENV PORT=3000
EXPOSE 3000
ENV HOSTNAME="0.0.0.0"

# Ensure Next.js can access runtime variables
CMD ["node", "server.js"]
```

### Deployment to AWS EC2 with Docker

Set up Docker on your EC2 instance:

```bash
sudo apt-get update
sudo apt-get install -y docker.io
sudo systemctl enable docker
sudo systemctl start docker
```

## CI/CD with CircleCI

### CircleCI Configuration

Create a `.circleci/config.yml` file in the root of your project:

```yaml
version: 2.1

orbs:
  node: circleci/node@5
  docker: circleci/docker@1.6.0

executors:
  node-executor:
    docker:
      - image: circleci/node:latest

jobs:
  build-docker:
    docker:
      - image: docker:20.10.7
    working_directory: /home/circleci/project
    environment:
      MONGO_URL: $MONGO_URL
      TOKEN_SECRET: $TOKEN_SECRET
      EDGE_STORE_ACCESS_KEY: $EDGE_STORE_ACCESS_KEY
      EDGE_STORE_SECRET_KEY: $EDGE_STORE_SECRET_KEY
    steps:
      - setup_remote_docker
      - checkout
      - run:
          name: Build Docker Image
          command: |
            docker build \
              --build-arg MONGO_URL=$MONGO_URL \
              --build-arg TOKEN_SECRET=$TOKEN_SECRET \
              --build-arg EDGE_STORE_ACCESS_KEY=$EDGE_STORE_ACCESS_KEY \
              --build-arg EDGE_STORE_SECRET_KEY=$EDGE_STORE_SECRET_KEY \
              -t moviefi-app .
      - run:
          name: Save Docker Image as Tarball
          command: docker save moviefi-app -o moviefi-app.tar
      - persist_to_workspace:
          root: /home/circleci/project
          paths:
            - moviefi-app.tar

  deploy-docker:
    docker:
      - image: circleci/node:latest
    working_directory: /home/circleci/deploy
    environment:
      $MONGO_URL
      $TOKEN_SECRET
      $EDGE_STORE_ACCESS_KEY
      $EDGE_STORE_SECRET_KEY
    steps:
      - attach_workspace:
          at: /home/circleci/deploy
      - add_ssh_keys:
          fingerprints:
            - SHA256:azWrDG0C26Q09r8D01kxy7D78YDQ2k+Nv9bL7S4AGcA
      - run:
          name: Transfer Docker Image to EC2
          command: |
            scp -o StrictHostKeyChecking=no /home/circleci/deploy/moviefi-app.tar ubuntu@ec2-13-50-189-192.eu-north-1.compute.amazonaws.com:/home/ubuntu/moviefi-app.tar
      - run:
          name: Deploy Docker Image on EC2
          command: |
            ssh -o StrictHostKeyChecking=no ubuntu@ec2-13-50-189-192.eu-north-1.compute.amazonaws.com \
              "echo Deploying Docker image... && \
              sudo systemctl start docker && \
              sudo docker load -i /home/ubuntu/moviefi-app.tar && \
              sudo docker rm -f moviefi-app || true && \
              sudo docker run -d --name moviefi-app \
                -p 80:3000 \
                -e MONGO_URL=$MONGO_URL \
                -e TOKEN_SECRET=$TOKEN_SECRET \
                -e EDGE_STORE_ACCESS_KEY=$EDGE_STORE_ACCESS_KEY \
                -e EDGE_STORE_SECRET_KEY=$EDGE_STORE_SECRET_KEY \
                moviefi-app && \
              echo 'Deployment complete!' || \
              echo 'Deployment failed!'"
workflows:
  version: 2
  build_and_deploy:
    jobs:
      - build-docker
      - deploy-docker:
          requires:
            - build-docker
```
