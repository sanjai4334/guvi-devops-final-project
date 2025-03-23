pipeline {
    agent any

    environment {
        DOCKER_HUB_REPO = 'sanjai4334/guvi-devops-final-project'
    }

    stages {
        stage('Checkout Code') {
            steps {
                git 'https://github.com/sanjai4334/guvi-devops-final-project.git'
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
                sh 'docker build -t $DOCKER_HUB_REPO:latest .'
            }
        }

        stage('Login to Docker Hub') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'docker-seccred', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                    sh 'echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin'
                }
            }
        }

        stage('Push to Docker Hub') {
            steps {
                sh 'docker push $DOCKER_HUB_REPO:latest'
            }
        }
    }
}
