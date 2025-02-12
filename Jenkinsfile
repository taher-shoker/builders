pipeline {
    agent any

    environment {
        APP_NAME = "cem#reporting#chat_bi"
        WAR_FILE = "target/${APP_NAME}"
        SERVER_1 = "10.21.196.243"
        SERVER_2 = "10.21.196.244"
        REMOTE_DEPLOY_DIR = "/data/tools/apache-tomcat-8.5.59/webapps"
        BACKUP_DIR = "/data/tools/apache-tomcat-8.5.59/webapps"
        SSH_USER = "osadmin"
        SSH_PASSWORD = "CEM435@#qeema"
    }

    stages {
        stage('Build') {
            steps {
                script {
                    sh "sudo /home/osadmin/.nvm/versions/node/v18.13.0/bin/npm install"
					//sh "npx nx run chatBI:build --configuration=production"
                }
            }
        }

        stage('Backup and Deploy') {
            parallel {
                stage('Server 1 Operations') {
                    stages {
                        stage('Backup WAR 243') {
                            steps {
                                script {
                                    sh """
                                        sshpass -p ${SSH_PASSWORD} ssh -o StrictHostKeyChecking=no ${SSH_USER}@${SERVER_1} "
                                            if [ -f ${REMOTE_DEPLOY_DIR}/cem#reporting#chat_bi ]; then 
                                                mv ${REMOTE_DEPLOY_DIR}/cem#reporting#chat_bi ${BACKUP_DIR}/cem#reporting#chat_bi-\$(date +'%Y-%m-%d-%H').jar;
                                            fi
                                        "
                                    """
                                }
                            }
                        }
                        stage('Deploy WAR 243') {
                            steps {
                                script {
                                    sh """
                                        sshpass -p ${SSH_PASSWORD} scp ${env.WAR_FILE} ${SSH_USER}@${SERVER_1}:${REMOTE_DEPLOY_DIR}/
                                    """
                                }
                            }
                        }
                    }
                }
                stage('Server 2 Operations') {
                    stages {
                        stage('Backup WAR 244') {
                            steps {
                                script {
                                    sh """
                                        sshpass -p ${SSH_PASSWORD} ssh -o StrictHostKeyChecking=no ${SSH_USER}@${SERVER_2} "
                                            if [ -f ${REMOTE_DEPLOY_DIR}/cem#reporting#chat_bi ]; then 
                                                mv ${REMOTE_DEPLOY_DIR}/cem#reporting#chat_bi ${BACKUP_DIR}/cem#reporting#chat_bi-\$(date +'%Y-%m-%d-%H').jar;
                                            fi
                                        "
                                    """
                                }
                            }
                        }
                        stage('Deploy WAR 244') {
                            steps {
                                script {
                                    sh """
                                        sshpass -p ${SSH_PASSWORD} scp ${env.WAR_FILE} ${SSH_USER}@${SERVER_2}:${REMOTE_DEPLOY_DIR}/
                                    """
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    post {
        always {
            echo 'Pipeline execution complete.'
        }
        success {
            echo 'Application deployed successfully on both servers!'
        }
        failure {
            echo 'Pipeline execution failed! Check the logs for details.'
        }
    }
}
