properties([
    parameters([
        choice(name: 'NX_APP', choices: ['chatBI', 'dtmv', 'ebe', 'dt-drf', 'di', 'd2d'], description: 'Select the application to build.'),
        choice(name: 'NX_APP_PATH', choices: ['chat_bi', 'dtmilestones', 'business-excellence-workspace', 'dynamic-rf-workspace', 'dtworkspace', 'fraudworkspace'], description: 'Select the app path under Apache Tomcat.')
    ])
])

pipeline {
    agent any

    stages {
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

        stage('Send Approval Email') {
            steps {
                script {
                    emailext (
                        subject: "Approval Required: Build #${env.BUILD_NUMBER}",
                        body: """
                            <html>
                                <body>
                                    <h2>Hello Mohamed Fawzy,</h2>
                                    <p>Please review the build for ${params.NX_APP} and approve or reject it through this <a href='http://10.24.44.12:8090/'>link</a></p>
                                    <br/>
                                    <br/>
                                    <br/>
                                    <p>Thank you!</p>
                                    <p><em>Jenkins Pipeline</em></p>
                                </body>
                            </html>
                        """,
                        to: 'mohfibrahim.c@stc.com.sa',
                        mimeType: 'text/html'
                    )
                }
            }
        }

        stage('Wait for Approval') {
            steps {
                script {
                    def userInput = input(
                        id: 'Approval', 
                        message: 'Please approve or reject the build', 
                        parameters: [
                            choice(name: 'action', choices: ['Approve', 'Reject'], description: 'Approve or Reject the build')
                        ]
                    )

                    if (userInput == 'Reject') {
                        error("Build rejected by manager.")
                    } else {
                        echo "Build approved by manager. Proceeding..."
                    }
                }
            }
        }

        stage('Deploy on Server 243') {
            steps {
                script {
                    sh """
                        sshpass -p 'CEM435@#qeema' scp -r /var/lib/jenkins/workspace/stc-apps/dist/apps/${params.NX_APP} osadmin@10.21.196.243:/data/tools/apache-tomcat-8.5.59/webapps/
                    """
                }
            }
        }

        stage('Backup & Rename 243') {
            steps {
                script {
                    sh """
                        sshpass -p 'CEM435@#qeema' ssh -o StrictHostKeyChecking=no osadmin@10.21.196.243 "/data/tools/apache-tomcat-8.5.59/webapps/scripts/rename_${params.NX_APP_PATH}.sh"
                    """
                }
            }
        }

        stage('Deploy on Server 244') {
            steps {
                script {
                    sh """
                        sshpass -p 'CEM435@#qeema' scp -r /var/lib/jenkins/workspace/stc-apps/dist/apps/${params.NX_APP} osadmin@10.21.196.244:/data/tools/apache-tomcat-8.5.59/webapps/
                    """
                }
            }
        }

        stage('Backup & Rename 244') {
            steps {
                script {
                    sh """
                        sshpass -p 'CEM435@#qeema' ssh -o StrictHostKeyChecking=no osadmin@10.21.196.244 "/data/tools/apache-tomcat-8.5.59/webapps/scripts/rename_${params.NX_APP_PATH}.sh"
                    """
                }
            }
        }
    }

    post {
        always {
            echo 'Pipeline execution complete.'
        }
        success {
            echo 'Application deployed successfully!'
        }
        failure {
            echo 'Pipeline execution failed!'
        }
    }
}