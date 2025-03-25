# GUVI Deevops Final Project
## CI/CD Pipeline for React App: Build, Push to Docker Hub, and Deploy on Minikube

> [!NOTE]  
> Make sure to change all the credentials and links to your own in all the files and commands.

### Create react projejct
```bash
npm create vite@latest . -- --template react
npm install
```

### Dockerfile
```groovy
# Use an official Node.js image to build the React app
FROM node:18 as build

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npm run build

# Use a lightweight web server for production
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

### Jenkinsfile
```groovy
pipeline {
    agent any

    environment {
        DOCKER_CREDENTIALS_ID = 'docker-seccred'
        DOCKER_HUB_REPO = 'sanjai4334/guvi-devops-final-project'
    }

    stages {
        stage('Clone Repository') {
            steps {
                git url: 'https://github.com/sanjai4334/guvi-devops-final-project.git', branch: 'main'
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
    }

    post {
        success {
            echo 'Pipeline succeeded!'
            echo 'Docker image pushed to Docker Hub!'
        }
        failure {
            echo 'Pipeline failed!'
        }
    }
}
```

 - Add these into the main repo folder and commit the changes

## Install these plugins 
 - ✅ Pipeline (Already included in newer Jenkins versions)
 - ✅ Git Plugin (For cloning repositories)
 - ✅ Docker Pipeline Plugin (For building & pushing Docker images)
 - ✅ Kubernetes Plugin (For deploying to Minikube)
 - ✅ Credentials Binding Plugin (For securely handling Docker Hub credentials)

## Create a pipeline job to push the docker image to dockerhub
 - Open Jenkins and create a pipeline job
 - In the connfigure section : 
    - In General section select `Discard old Builds` and set days to keep build and no of builds to keep as `2`
 - Scroll down to `Pipeline` section :
    - Select `Pipeline script from SCM`
    - In `SCM` select `git` and paste your `Repository URL` and change the branch to `main`
 - Click Save and then Build

![image](https://github.com/user-attachments/assets/875a758f-d546-4663-be6e-40e7ff6a1e02)

## Pull the image from Docker hub and run the build using Minikube
 - Open your terminal and execute the following commands

```bash
minikube start
kubectl create deployment guvi-devops-final --image=sanjai4334/guvi-devops-final-project:latest
kubectl expose deployment guvi-devops-final --type=NodePort --port=80
minikube service guvi-devops-final
```

![image](https://github.com/user-attachments/assets/13abc9c0-38bb-48ac-8f19-6d43634bf387)
