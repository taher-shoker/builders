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
        
        stage('Deploy on Server 243') {
            steps {
                script {
                    sh """
                        sshpass -p ${SSH_PASSWORD} scp -r ${WAR_FILE} ${SSH_USER}@${SERVER_1}:${REMOTE_DEPLOY_DIR}/
                    """
                }
            }
        }
        
        stage('Rename 243') {
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
        
        stage('Rename 244') {
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