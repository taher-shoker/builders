pipeline {
    agent any

    parameters {
        string(name: 'NX_APP', defaultValue: '', description: 'Select the app to build')
        string(name: 'NX_APP_PATH', defaultValue: '', description: 'Select the app path under the apache tomcat')
    }

    stages {
        stage('Checkout Code') {
            steps {
                git branch: 'main', url: 'git@gitlab.stc.com.sa:mohfibrahim/stc-apps.git'
            }
        }

        stage('Install Dependencies') {
            steps {
                sh '/usr/bin/npm install --legacy-peer-deps --no-fund --no-audit'
            }
        }

        stage('Build Specific App') {
            steps {
                script {
                    if (params.NX_APP == '') {
                        error "You must specify an app to build!"
                    }

                    if (params.NX_APP_PATH == '') {
                        error "You must specify an app path to build!"
                    }

                    sh "npx nx run ${params.NX_APP}:build --configuration=production --base-href=/cem/reporting/${params.NX_APP_PATH}/"
                }
            }
        }
    }
}
