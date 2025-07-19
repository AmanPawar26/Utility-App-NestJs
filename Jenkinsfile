pipeline {
  agent any

  environment {
    IMAGE_NAME = 'pawaramanraju/utility-app'
    IMAGE_TAG = 'latest'
    BACKEND_DIR = 'backend'
    FRONTEND_DIR = 'frontend/vite-project'
  }

  stages {
    stage('Checkout') {
      steps {
       git branch: 'main', url: 'https://github.com/AmanPawar26/Utility-App-NestJs'
      }
    }

    stage('Install & Test Backend') {
      steps {
        dir("${BACKEND_DIR}") {
          sh '''
            docker run --rm -v $(pwd):/app -w /app node:18 bash -c "npm install && npm run test:unit && npm run test:integration"
          '''
        }
      }
    }

    stage('Install & Test Frontend') {
      steps {
        dir("${FRONTEND_DIR}") {
          sh '''
            docker run --rm -v $(pwd):/app -w /app node:18 bash -c "npm install && npm run test:unit && npm run test:integration"
          '''
        }
      }
    }

    stage('Build Combined Docker Image') {
      steps {
        script {
          dockerImage = docker.build("${IMAGE_NAME}:${IMAGE_TAG}")
        }
      }
    }

    stage('Push to Docker Hub') {
      steps {
        script {
          docker.withRegistry('https://index.docker.io/v1/', 'dockerhub-creds') {
            dockerImage.push()
          }
        }
      }
    }
  }
}
