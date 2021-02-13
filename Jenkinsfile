pipeline {
  agent { docker { image 'node:14-alpine' } }
  stages {
    stage('test') {
      steps {
        sh 'npm test:jenkins'
      }
    }
    stage('build') {
      steps {
        sh 'npm i'
        sh 'npm android-bundle-release'
      }
    }
  }
  post {
    always {
      echo 'This will always run'
    }
    success {
      echo 'This will run only if successful'
    }
    failure {
      echo 'This will run only if failed'
    }
    unstable {
      echo 'This will run only if the run was marked as unstable'
    }
    changed {
      echo 'This will run only if the state of the Pipeline has changed'
      echo 'For example, if the Pipeline was previously failing but is now successful'
    }
  }
}
