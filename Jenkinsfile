pipeline {
  agent any
  stages {
    stage('init') {
      steps {
        sh 'sudo apt install curl'
        sh 'curl -sL https://deb.nodesource.com/setup_10.x -o nodesource_setup.sh'
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
        sh 'npm run test:ci'
        sh 'python3 tools/lcov_cobertura.py coverage/lcov.info --base-dir src/ --output coverage/coverage.xml'
      }
    }
    stage('build') {
      steps {
        withEnv([
          'PATH+=/var/lib/jenkins/sdk/platform-tools',
          'JAVA_HOME=/usr/lib/jvm/java-11-openjdk-amd64',
          'ANDROID_SDK_ROOT=/var/lib/jenkins/sdk'
        ]) {
          sh "ls $ANDROID_SDK_ROOT"
          sh 'npm run android-bundle-release'
        }
      }
    }
  }
  post {
    success {
      echo 'Build successful!'
      junit skipPublishingChecks: true, testResults: 'coverage/junit.xml'
      publishCoverage adapters: [coberturaAdapter(path: 'coverage/coverage.xml', thresholds: [[failUnhealthy: true, thresholdTarget: 'Aggregated Report', unhealthyThreshold: 90.0, unstableThreshold: 99.0]])], sourceFileResolver: sourceFiles('NEVER_STORE')
    }
    failure {
      echo 'Build failed :('
    }
  }
}
