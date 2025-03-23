pipeline {
    agent any

    environment {
        // 🔹 Change These Values for Different Projects 🔹
        REPO_URL = 'https://github.com/sanjai4334/guvi-devops-final-project.git'  // GitHub repository URL
        REPO_BRANCH = 'main' // Github repository branch
        DOCKER_IMAGE_NAME = 'guvi-devops-final-project'  // Docker image name (without username)
        DOCKER_CREDENTIALS_ID = 'docker-seccred'  // Jenkins credential ID for Docker Hub
    }

    stages {
        stage('Clone Repository') {
            steps {
                git branch:REPO_BRANCH, url:REPO_URL
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
            withCredentials([usernamePassword(credentialsId: DOCKER_CREDENTIALS_ID, usernameVariable: 'DOCKER_USERNAME', passwordVariable: 'DOCKER_PASSWORD')]) {
                sh '''
                export DOCKER_USERNAME=$DOCKER_USERNAME
                envsubst < deployment.yaml > deployment-final.yaml
                kubectl apply -f deployment-final.yaml
                '''
            }
        }
    }

    }
}
