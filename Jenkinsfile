pipeline {
    agent any

    environment {
        FRONTEND_IMAGE = 'pawaramanraju/utility-frontend:latest'
        BACKEND_IMAGE  = 'pawaramanraju/utility-backend:latest'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Test Frontend') {
            steps {
                dir('frontend/vite-project') {
                    bat 'npm ci'
                    bat 'npm run test:unit'
                    bat 'npm run test:integration'
                }
            }
        }

        stage('Test Backend') {
            steps {
                dir('backend') {
                    bat 'npm ci'
                    bat 'npm run test:unit'
                    bat 'npm run test:integration'
                }
            }
        }

        stage('Build Frontend Image') {
            steps {
                bat 'docker build -f Dockerfile.frontend -t %FRONTEND_IMAGE% .'
            }
        }

        stage('Build Backend Image') {
            steps {
                bat 'docker build -f Dockerfile.backend -t %BACKEND_IMAGE% .'
            }
        }

        stage('Push Images to DockerHub') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'docker_cred',
                    usernameVariable: 'DOCKERHUB_USERNAME',
                    passwordVariable: 'DOCKERHUB_PASSWORD'
                )]) {
                    bat 'docker login -u %DOCKERHUB_USERNAME% -p %DOCKERHUB_PASSWORD%'
                    bat 'docker push %FRONTEND_IMAGE%'
                    bat 'docker push %BACKEND_IMAGE%'
                    bat 'docker logout'
                }
            }
        }
    }
}
