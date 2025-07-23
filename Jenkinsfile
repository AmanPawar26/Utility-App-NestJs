pipeline {
    agent any

    environment {
        DOCKER_IMAGE = "pawaramanraju/utilityapp:latest"
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

        stage('Build Docker Image') {
            steps {
                bat 'docker build -t %DOCKER_IMAGE% .'
            }
        }

        stage('Push Docker Image') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'docker_cred',
                    usernameVariable: 'DOCKERHUB_USERNAME',
                    passwordVariable: 'DOCKERHUB_PASSWORD'
                )]) {
                    bat 'docker login -u %DOCKERHUB_USERNAME% -p %DOCKERHUB_PASSWORD%'
                    bat 'docker push %DOCKER_IMAGE%'
                    bat 'docker logout'
                }
            }
        }
    }
}
