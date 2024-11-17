Sure! Here's the updated README documentation for your Next.js project, MovieFi, including additional details on deploying to AWS and using CircleCI for CI/CD:

---

# MovieFi

MovieFi is a full-stack Next.js application that allows users to manage their movie collection. The application includes features like login, signup, displaying all movies, adding new movies, and editing existing movies. This project uses CircleCI for continuous integration and deployment (CI/CD).

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Usage](#usage)
- [Deployment](#deployment)
- [CI/CD with CircleCI](#cicd-with-circleci)
- [Contributing](#contributing)
- [License](#license)

## Features

- **Login**: User authentication through a login page.
- **Signup**: New user registration through a signup page.
- **Movie Listing**: Display all movies with their title, publishing year, and poster in a card format on the homepage.
- **Add Movie**: Add new movies to the collection through an add movie page.
- **Edit Movie**: Edit existing movie details through an edit movie page.

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/moviefi.git
   cd moviefi
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

## Environment Variables

Create a `.env` file in the root directory and add the following environment variables:

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

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application in action.

## Deployment

### Deploying to AWS EC2

1. **Prepare Your EC2 Instance**:

   - Create an EC2 instance and make sure it is set up and accessible via SSH.
   - Install Node.js using `nvm` (Node Version Manager):

     ```bash
     curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.38.0/install.sh | bash
     nvm install node
     ```

   - Install `nginx` for reverse proxy:

     ```bash
     sudo apt update
     sudo apt install nginx
     ```

   - Install `pm2` for process management:

     ```bash
     npm install -g pm2
     ```

   - Create a directory for your project and clone the repository:
     ```bash
     mkdir /path/to/your/project
     cd /path/to/your/project
     git clone https://github.com/yourusername/moviefi.git .
     ```

2. **Deploy Your Application**:
   - Use the following CircleCI configuration to automate the deployment process.

### CI/CD with CircleCI

Create a `.circleci/config.yml` file in the root of your project with the following content:

    ```yaml
    version: 2.1

    orbs:
      node: circleci/node@5

    executors:
      node-executor:
        docker:
          - image: circleci/node:latest

    jobs:
      build-node:
        executor: node/default
        environment:
          MONGO_URL: $MONGO_URL
          TOKEN_SECRET: $TOKEN_SECRET
          EDGE_STORE_ACCESS_KEY: $EDGE_STORE_ACCESS_KEY
          EDGE_STORE_SECRET_KEY: $EDGE_STORE_SECRET_KEY

        steps:
          - checkout
          - node/install-packages:
              pkg-manager: npm
          - run:
              command: npm run build
          # - run:
          #     command: npm test

      deploy:
        executor: node-executor
        steps:
          - checkout
          - add_ssh_keys:
              fingerprints:
                - "SHA256:dYXfn3ckS9d+Xu1bigRggd39erp+aiddhQPKuMBXtoA"
          - run:
              name: Deploy to EC2
              command: |
                ssh -o StrictHostKeyChecking=no ubuntu@ec2-52-204-181-195.compute-1.amazonaws.com "cd /path/to/your/project && git pull origin main && npm install && npm run build && pm2 restart all"
          - run: echo "Deployment complete!"

    workflows:
      version: 2
      build_and_deploy:
        jobs:
          - build-node
          - deploy:
              requires:
                - build-node
    ```

## Contributing

If you would like to contribute to MovieFi, please fork the repository and create a pull request. We welcome all improvements and suggestions!

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
