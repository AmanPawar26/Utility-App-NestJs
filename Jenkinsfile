pipeline {
  agent any

  environment {
    BACKEND_IMAGE = 'pawaramanraju/backend:latest'
    FRONTEND_IMAGE = 'pawaramanraju/frontend:latest'
  }

  stages {
    stage('Checkout') {
      steps {
        git url: 'https://github.com/AmanPawar26/Utility-App-NestJs', branch: 'main'
      }
    }

    stage('Prepare Secrets') {
      steps {
        withCredentials([
          file(credentialsId: 'env-file', variable: 'ENV_FILE'),
          file(credentialsId: 'google-key', variable: 'GOOGLE_KEY')
        ]) {
          bat """
            copy %ENV_FILE% backend\\.env
            if not exist backend\\src\\keys mkdir backend\\src\\keys
            copy %GOOGLE_KEY% backend\\src\\keys\\sheets-credentials.json
          """
        }
      }
    }

    stage('Build Backend Docker Image') {
      steps {
        bat 'docker build -t %BACKEND_IMAGE% -f Dockerfile.backend .'
      }
    }

    stage('Build Frontend Docker Image') {
      steps {
        bat 'docker build -t %FRONTEND_IMAGE% -f Dockerfile.frontend .'
      }
    }

    stage('Push Docker Images (Optional)') {
      when {
        expression { return env.DOCKER_USERNAME != null }
      }
      steps {
        withCredentials([usernamePassword(credentialsId: 'dockerhub-creds', usernameVariable: 'DOCKER_USERNAME', passwordVariable: 'DOCKER_PASSWORD')]) {
          bat """
            echo %DOCKER_PASSWORD% | docker login -u %DOCKER_USERNAME% --password-stdin
            docker push %BACKEND_IMAGE%
            docker push %FRONTEND_IMAGE%
          """
        }
      }
    }

    stage('Cleanup Secrets') {
      steps {
        bat 'del backend\\.env'
        bat 'del backend\\src\\keys\\sheets-credentials.json'
      }
    }
  }

  post {
    always {
      cleanWs()
    }
  }
}
