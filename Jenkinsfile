pipeline {
  agent any

  environment {
    DOCKER_IMAGE = 'pawaramanraju/utility-backend'
    DOCKER_TAG = 'latest-jenkins'
  }

  stages {
    stage('Checkout Source') {
      steps {
        checkout scm
      }
    }

    stage('Inject Secrets') {
      steps {
        withCredentials([
          file(credentialsId: 'env-file', variable: 'ENV_FILE'),
          file(credentialsId: 'google-key', variable: 'GOOGLE_KEY')
        ]) {
          sh """
            echo "[INFO] Injecting secrets"
            cp $ENV_FILE backend/.env

            mkdir -p backend/src/keys
            cp $GOOGLE_KEY backend/src/keys/sheets-credentials.json
          """
        }
      }
    }

    stage('Build Docker Image') {
      steps {
        script {
          docker.build("${DOCKER_IMAGE}:${DOCKER_TAG}", "-f Dockerfile.backend .")
        }
      }
    }

    stage('Push to DockerHub') {
      when {
        expression { return env.DOCKER_IMAGE?.trim() }
      }
      steps {
        withCredentials([usernamePassword(credentialsId: 'dockerhub-creds', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
          sh """
            echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin
            docker push ${DOCKER_IMAGE}:${DOCKER_TAG}
          """
        }
      }
    }
  }

  post {
    cleanup {
      sh 'docker system prune -f'
    }
  }
}
