pipeline {
  agent any
  stages {
    stage('init') {
      steps {
        sh 'curl https://raw.githubusercontent.com/creationix/nvm/master/install.sh | bash '
        sh 'export NVM_DIR="$HOME/.nvm" && [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"'
        sh 'nvm install 15.2.1'
        sh 'npm i'
      }
    }
    stage('test') {
      steps {
        sh 'npm test:jenkins'
      }
    }
    stage('build') {
      steps {
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
