pipeline {
    agent any

    environment {
        APP_NAME = "cem#reporting#chat_bi"
        WAR_FILE = "/var/lib/jenkins/workspace/chatBI_frontend/dist/apps/chatBI/"
        SERVER_1 = "10.21.196.243"
        SERVER_2 = "10.21.196.244"
        REMOTE_DEPLOY_DIR = "/data/tools/apache-tomcat-8.5.59/webapps"
        BACKUP_DIR = "/data/tools/apache-tomcat-8.5.59/webapps/backup"
        SSH_USER = "osadmin"
        SSH_PASSWORD = "CEM435@#qeema"
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
        stage('Backup and Deploy') {
            parallel {
                stage('Server 1 Operations') {
                    stages {
                        stage('Backup 243') {
                            steps {
                                script {
                                    sh """
                                        sshpass -p ${SSH_PASSWORD} ssh -o StrictHostKeyChecking=no ${SSH_USER}@${SERVER_1} "
                                            if [ -f ${REMOTE_DEPLOY_DIR}/${APP_NAME} ]; then 
                                                mv ${REMOTE_DEPLOY_DIR}/${APP_NAME} ${BACKUP_DIR}/${APP_NAME}-\$(date +'%Y-%m-%d-%H');
                                            fi
                                        "
                                    """
                                }
                            }
                        }
                        stage('Deploy 243') {
                            steps {
                                script {
                                    sh """
                                        sshpass -p ${SSH_PASSWORD} scp ${env.WAR_FILE} ${SSH_USER}@${SERVER_1}:${REMOTE_DEPLOY_DIR}/${APP_NAME}
                                    """
                                }
                            }
                        }
                    }
                }
                stage('Server 2 Operations') {
                    stages {
                        stage('Backup 244') {
                            steps {
                                script {
                                    sh """
                                        sshpass -p ${SSH_PASSWORD} ssh -o StrictHostKeyChecking=no ${SSH_USER}@${SERVER_2} "
                                            if [ -f ${REMOTE_DEPLOY_DIR}/${APP_NAME} ]; then 
                                                mv ${REMOTE_DEPLOY_DIR}/${APP_NAME} ${BACKUP_DIR}/${APP_NAME}-\$(date +'%Y-%m-%d-%H');
                                            fi
                                        "
                                    """
                                }
                            }
                        }
                        stage('Deploy 244') {
                            steps {
                                script {
                                    sh """
                                        sshpass -p ${SSH_PASSWORD} scp ${env.WAR_FILE} ${SSH_USER}@${SERVER_2}:${REMOTE_DEPLOY_DIR}/${APP_NAME}
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