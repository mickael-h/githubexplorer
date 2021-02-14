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
        sh 'mkdir sdk'
        sh 'echo yes | ./cmdline-tools/bin/sdkmanager "platform-tools" --sdk_root="$HOME/sdk"'
        sh 'echo yes | ./cmdline-tools/bin/sdkmanager "platforms;android-29" --sdk_root="$HOME/sdk"'
        sh 'echo yes | ./cmdline-tools/bin/sdkmanager "platforms;android-28" --sdk_root="$HOME/sdk"'
        sh 'echo yes | ./cmdline-tools/bin/sdkmanager "build-tools;28.0.3" --sdk_root="$HOME/sdk"'
        sh 'echo yes | ./cmdline-tools/bin/sdkmanager "build-tools;29.0.2" --sdk_root="$HOME/sdk"'
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
        withEnv([
          'PATH+=/var/lib/jenkins/sdk/platform-tools',
          'JAVA_HOME=/usr/lib/jvm/java-11-openjdk-amd64',
          'ANDROID_SDK_ROOT=/var/lib/jenkins/sdk'
        ]) {
          echo "$ANDROID_SDK_ROOT"
          sh "ls $ANDROID_SDK_ROOT"
          sh 'npm run android-bundle-release'
        }
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
