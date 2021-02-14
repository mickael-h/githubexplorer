pipeline {
  agent any
  stages {
    stage('init') {
      steps {
        sh 'curl -sL https://deb.nodesource.com/setup_15.x -o nodesource_setup.sh'
        sh 'sudo bash nodesource_setup.sh'
        sh 'sudo apt install nodejs -y'
        sh 'node -v'
        sh 'npm i'
      }
    }
    stage('test') {
      steps {
        sh 'npm run test:jenkins'
      }
    }
    stage('build') {
      steps {
        sh 'npm run android-bundle-release'
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
