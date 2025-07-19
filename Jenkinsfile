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
          sh 'npm install'
          sh 'npm run test:unit'
          sh 'npm run test:integration'
        }
      }
    }

    stage('Install & Test Frontend') {
      steps {
        dir("${FRONTEND_DIR}") {
          sh 'npm install'
          sh 'npm run test:unit'
          sh 'npm run test:integration'
        }
      }
    }

    stage('Build Docker Images') {
      steps {
        dir("${BACKEND_DIR}") {
          sh 'docker build -t utility-backend .'
        }
        dir("${FRONTEND_DIR}") {
          sh 'docker build -t utility-frontend .'
        }
      }
    }
  }
}
