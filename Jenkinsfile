pipeline {
    agent any

    environment {
        REPO_URL = 'https://github.com/sanjai4334/guvi-devops-final-project.git'
        REPO_BRANCH = 'main'
        DOCKER_IMAGE_NAME = 'guvi-devops-final-project'
        DOCKER_CREDENTIALS_ID = 'docker-seccred'
    }

    stages {
        stage('Clone Repository') {
            steps {
                git branch:REPO_BRANCH, url:REPO_URL
            }
        }

        stage('Clean Workspace') {
            steps {
                sh 'rm -rf node_modules build'
            }
        }

        stage('Build React App') {
            steps {
                sh 'npm install'
                sh 'npm run build'
            }
        }

        stage('Build Docker Image') {
            steps {
                withCredentials([usernamePassword(credentialsId: DOCKER_CREDENTIALS_ID, usernameVariable: 'DOCKER_USERNAME', passwordVariable: 'DOCKER_PASSWORD')]) {
                    sh "docker build -t $DOCKER_USERNAME/$DOCKER_IMAGE_NAME:latest ."
                }
            }
        }

        stage('Login to Docker Hub') {
            steps {
                withCredentials([usernamePassword(credentialsId: DOCKER_CREDENTIALS_ID, usernameVariable: 'DOCKER_USERNAME', passwordVariable: 'DOCKER_PASSWORD')]) {
                    sh "echo $DOCKER_PASSWORD | docker login -u $DOCKER_USERNAME --password-stdin"
                }
            }
        }

        stage('Push Docker Image') {
            steps {
                withCredentials([usernamePassword(credentialsId: DOCKER_CREDENTIALS_ID, usernameVariable: 'DOCKER_USERNAME', passwordVariable: 'DOCKER_PASSWORD')]) {
                    sh "docker push $DOCKER_USERNAME/$DOCKER_IMAGE_NAME:latest"
                }
            }
        }

        stage('Deploy on Minikube') {
            steps {
                sh "kubectl config use-context minikube"
                sh "kubectl apply -f deployment.yaml --validate=FALSE"
            }
        }

        stage('Restart Deployment') {
            steps {
                sh "kubectl rollout restart deployment guvi-devops-final-project"
            }
        }
    }
}