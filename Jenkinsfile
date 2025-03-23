pipeline {
    agent any

    environment {
        DOCKER_CREDENTIALS_ID = 'docker-seccred'
        DOCKER_HUB_REPO = 'sanjai4334/guvi-devops-final-project'
    }

    stages {
        stage('Clone Repository') {
            steps {
                git credentialsId: 'github-seccred', url: 'https://github.com/sanjai4334/guvi-devops-final-project.git', branch: 'main'
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    sh 'docker build -t $DOCKER_HUB_REPO:latest .'
                }
            }
        }

        stage('Login to Docker Hub') {
            steps {
                script {
                    withCredentials([usernamePassword(credentialsId: DOCKER_CREDENTIALS_ID, usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                        sh 'echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin'
                    }
                }
            }
        }

        stage('Push Docker Image') {
            steps {
                script {
                    sh 'docker push $DOCKER_HUB_REPO:latest'
                }
            }
        }

        stage('Deploy to Minikube') {
            steps {
                script {
                    sh '''
                    kubectl delete deployment guvi-devops-final || true
                    kubectl create deployment guvi-devops-final --image=$DOCKER_HUB_REPO:latest
                    kubectl expose deployment guvi-devops-final --type=NodePort --port=80
                    '''
                }
            }
        }
    }

    post {
        success {
            echo 'Deployment successful!'
        }
        failure {
            echo 'Pipeline failed!'
        }
    }
}