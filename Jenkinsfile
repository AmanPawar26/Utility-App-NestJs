pipeline {
  agent any

  environment {
    BACKEND_DIR = 'backend'
    FRONTEND_DIR = 'frontend/vite-project'
  }

  stages {
    stage('Install & Test Backend') {
      steps {
        dir("${BACKEND_DIR}") {
          bat 'npm install'
          bat 'npm run test:unit'
          bat 'npm run test:integration'
        }
      }
    }

    stage('Install & Test Frontend') {
      steps {
        dir("${FRONTEND_DIR}") {
          bat 'npm install'
          bat 'npm run test:unit'
          bat 'npm run test:integration'
        }
      }
    }

    stage('Build Docker Images') {
      steps {
        dir("${BACKEND_DIR}") {
          bat 'docker build -t utility-backend .'
        }
        dir("${FRONTEND_DIR}") {
          bat 'docker build -t utility-frontend .'
        }
      }
    }
  }
}
