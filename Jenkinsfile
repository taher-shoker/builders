pipeline {
    agent any

    environment {
        APP_NAME = "chat_bi"
        WAR_FILE = "/var/lib/jenkins/workspace/chatBI_frontend/dist/apps/chatBI/"
        SERVER_1 = "10.21.196.243"
        SERVER_2 = "10.21.196.244"
        REMOTE_DEPLOY_DIR = "/data/tools/apache-tomcat-8.5.59/webapps"
        BACKUP_DIR = "/data/tools/apache-tomcat-8.5.59/webapps/backup"
        SSH_USER = "osadmin"
        SSH_PASSWORD = "CEM435@#qeema"
		BUILD_URL = "chatBI_frontend_Deployment"
    }

    stages {
        stage('Package Installation') {
            steps {
                script {
                    sh "npm run install"
                }
            }
        }
        
        stage('Build') {
            steps {
                script {
                    sh "npm run build:chat:prod"
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
                                    <p>Please review the build and approve or reject it.</p>
                                    <p>
                                        <strong>Approve:</strong> 
                                        <a href="${env.BUILD_URL}input/Approval/proceed">Click here to Approve</a>
                                    </p>
                                    <p>
                                        <strong>Reject:</strong> 
                                        <a href="${env.BUILD_URL}input/Approval/abort">Click here to Reject</a>
                                    </p>
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
                        sshpass -p ${SSH_PASSWORD} scp -r ${WAR_FILE} ${SSH_USER}@${SERVER_1}:${REMOTE_DEPLOY_DIR}/
                    """
                }
            }
        }
        
        stage('Rename & Backup 243') {
            steps {
                script {
                    sh """
                        sshpass -p ${SSH_PASSWORD} ssh -o StrictHostKeyChecking=no ${SSH_USER}@${SERVER_1} "/data/tools/apache-tomcat-8.5.59/webapps/scripts/rename_chatbi.sh"
                    """
                }
            }
        }
        
        stage('Deploy on Server 244') {
            steps {
                script {
                    sh """
                        sshpass -p ${SSH_PASSWORD} scp -r ${WAR_FILE} ${SSH_USER}@${SERVER_2}:${REMOTE_DEPLOY_DIR}/
                    """
                }
            }
        }
        
        stage('Rename & Backup 244') {
            steps {
                script {
                    sh """
                        sshpass -p ${SSH_PASSWORD} ssh -o StrictHostKeyChecking=no ${SSH_USER}@${SERVER_2} "/data/tools/apache-tomcat-8.5.59/webapps/scripts/rename_chatbi.sh"
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