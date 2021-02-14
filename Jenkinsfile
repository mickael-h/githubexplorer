pipeline {
  agent any
  stages {
    stage('init') {
      steps {
        sh 'curl -sL https://deb.nodesource.com/setup_15.x -o nodesource_setup.sh'
        sh 'sudo bash nodesource_setup.sh'
        sh 'sudo apt install nodejs openjdk-11-jdk openjdk-11-jre unzip -y'
        sh 'node -v'
        sh 'wget https://dl.google.com/android/repository/commandlinetools-linux-6858069_latest.zip'
        sh 'unzip commandlinetools-linux-6858069_latest.zip'
        sh 'rm commandlinetools-linux-6858069_latest.zip'
        sh 'export PATH="$PATH:$HOME/cmdline-tools/bin"'
        sh './cmdline-tools/bin/sdkmanager "platform-tools" "platforms;android-28" "platforms;android-29"'
        sh 'which javac'
        sh 'export JAVA_HOME="/usr/lib/jvm/java-11-openjdk-amd64"'
        sh 'ls /opt/android/sdk'
        sh 'export ANDROID_SDK_ROOT="/opt/android/sdk"'
        sh 'export PATH="$PATH:$ANDROID_SDK_ROOT/platform-tools"'
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
