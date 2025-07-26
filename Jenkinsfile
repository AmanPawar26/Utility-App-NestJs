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

    stage('Run Application') {
      steps {
        bat '''
          docker network create utility-network || exit 0

          docker run -d --rm ^
            --name backend ^
            --env-file backend\\.env ^
            -v %CD%\\backend\\src\\keys:/app/src/keys ^
            --network utility-network ^
            -p 3000:3000 ^
            %BACKEND_IMAGE%

          docker run -d --rm ^
            --name frontend ^
            --network utility-network ^
            -p 80:80 ^
            %FRONTEND_IMAGE%
        '''
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
